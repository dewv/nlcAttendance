const ldap = require("ldapjs");

/**
 * Handles request to submit the login form. 
 * @argument {external:Request} request -  The HTTP request.
 * @argument {external:Response} response - The HTTP response.
 * @public
 * @async
 */
module.exports = async function (request, response) {
    let domain = "@dewv.edu";
    if (request.body.username.indexOf("@") < 0 && request.body.username.slice(-domain.length) !== domain) {
        request.body.username = request.body.username + domain;
    }

    let result;
    /* istanbul ignore if */
    if (sails.config.custom.ldap) {
        result = await _ldapAuthentication(request.body.username, request.body.password);
    } else {
        result = _simulatedAuthentication(request.body.username, request.body.password);
    }

    if (result instanceof ldap.InvalidCredentialsError) {
        request.session.banner = "Invalid username and/or password.";
        return response.redirect(sails.config.custom.baseUrl + "/logout");
    } else if (result instanceof ldap.InsufficientAccessRightsError) {
        request.session.banner = "Sorry, you are not authorized to use this system.";
        return response.redirect(sails.config.custom.baseUrl + "/logout");
    } else if (result instanceof ldap.UnavailableError) {
        sails.log.debug("appeal to security question");
        // LDAP is unavailable; appeal to security question
        return response.redirect(sails.config.custom.baseUrl + "/nonexistentSecurityQuestionUrl"); // TODO
    }

    for (const property in result) {
        request.session[property] = result[property];
    }

    let userProfile = await sails.models[request.session.role].findOrCreate({
        username: request.body.username
    }, {
        username: request.body.username,
        firstName: request.session.firstName,
        lastName: request.session.lastName
    });

    request.session.userId = userProfile.id;
    request.session.username = userProfile.username;

    if (request.session.role === "staff") {
        request.session.nextUrl = `${sails.config.custom.baseUrl}/visit`;
    } else if (request.session.role === "student") {
        request.session.forceProfileUpdate = userProfile.forceUpdate;
        request.session.visit = await sails.helpers.getLatestVisit(request.session.userId);
        if (request.session.forceProfileUpdate) request.session.nextUrl = `${sails.config.custom.baseUrl}/student/${request.session.userId}/edit`;
        else if (request.session.visit.checkOutTime) request.session.nextUrl = `${sails.config.custom.baseUrl}/visit/new`;
        else request.session.nextUrl = `${sails.config.custom.baseUrl}/visit/${request.session.visit.id}/edit`;
    }

    return response.redirect(request.session.nextUrl);
};

/**
 * Checks login credentials against an LDAP server. 
 * @argument {string} username -  The submitted username. 
 * @argument {string} password -  The submitted password. 
 * @return {Object} A dictionary of user information, or an LDAP-defined Error object.
 * @private
 * @async
 */
async function _ldapAuthentication(username, password) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
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

            client.bind(username, password, function (error) {
                if (error) {
                    if (error instanceof ldap.InvalidCredentialsError) {
                        return resolve(error);
                    }
                    return _handleError(`LDAP bind handler: ${error.message}`);
                }

                // Authentication was successful. Get information about user. 
                ldapConfig.searchOptions.filter = `(userPrincipalName=${username})`;
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
    });
}

/**
 * Checks login credentials for development use. 
 * @argument {string} username -  The submitted username. 
 * @argument {string} password -  The submitted password. 
 * @return {Object} A dictionary of user information, or an LDAP-defined Error object.
 * @private
 * @async
 */
function _simulatedAuthentication(username, password) {
    if (password === "student" || password === "staff") {
        return {
            role: password,
            firstName: "First",
            lastName: "Last"
        };
    } else if (password === "neither") {
        return new ldap.InsufficientAccessRightsError();
    } else if (password === "noldap") {
        return new ldap.UnavailableError();
    }

    return new ldap.InvalidCredentialsError();
}
