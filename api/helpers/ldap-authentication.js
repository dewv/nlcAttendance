const ldap = require("ldapjs");

module.exports = {
    friendlyName: "Authenticate credentials using LDAP",

    description: "Returns details of application status and configuration.",

    inputs: {
        username: {
            description: "An alleged username",
            type: "string",
            required: true,
        },
        password: {
            description: "An alleged password",
            type: "string",
            required: true,
        },
    },

    exits: {
        success: {
            description: "All done.",
        },
    },

    fn: async function (inputs, exits) {
        return exits.success(new Promise((resolve) => {
            const ldapConfig = sails.config.custom.ldap;
            const clientOptions = ldapConfig.clientOptions;
            let client = ldap.createClient(clientOptions);

            client.on("error", function (error) {
                _handleError(`LDAP client error handler: ${error.message}`);
            });

            client.on("connectError", function (error) {
                _handleError(`LDAP connectError handler: ${error.message}`);
            });

            client.on("connect", function (_socket, error) {
                if (error) {
                    return _handleError(`LDAP connect handler: ${error.message}`);
                }

                client.bind(inputs.username, inputs.password, function (error) {
                    if (error) {
                        if (error instanceof ldap.InvalidCredentialsError) {
                            return resolve(error);
                        }
                        return _handleError(`LDAP bind handler: ${error.message}`);
                    }

                    // Authentication was successful. Get information about user.
                    ldapConfig.searchOptions.filter = `(userPrincipalName=${inputs.username})`;
                    client.search(ldapConfig.searchBaseDn, ldapConfig.searchOptions, function (error, searchResponse) {
                        if (error) {
                            return _handleError(`LDAP client search: ${error.message}`);
                        }

                        searchResponse.on("error", function (error) {
                            _handleError(`LDAP search response error handler: ${error.message}`);
                        });

                        searchResponse.on("searchEntry", function (entry) {
                            client.unbind();

                            // Build result using configured aliases (e.g., "sn" -> "lastName")
                            let result = {};
                            for (let attribute of ldapConfig.searchOptions.attributes) {
                                if (ldapConfig.searchResultAliases[attribute]) {
                                    result[ldapConfig.searchResultAliases[attribute]] = entry.object[attribute];
                                }
                            }

                            // Set user role(s) based on LDAP distinguished name (dn).
                            let ldapRoles = sails.config.custom.ldap.roles;
                            for (const rule of ldapRoles) {
                                if (entry.object.dn.indexOf(rule.dnContains) >= 0) {
                                    result.role = rule.role;
                                }
                            }

                            // User must have at least one role.
                            if (!result.role) return resolve(new ldap.InsufficientAccessRightsError());

                            resolve(result);
                        });
                    });
                });
            });

            function _handleError(message) {
                // Defensive programming: not clear when/why ldapjs might error here.
                sails.log.warn(message);
                resolve(new ldap.UnavailableError());
            }
        }));
    }
};
