const ldap = require("ldapjs");

/**
 * Routes login and logout requests. 
 * @implements Controller
 * @module
 */
let AuthController = {
    /**
     * Handles request to display a form for entering a new data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    loginFormRequested: async function (request, response) {
        return sails.helpers.responseViewSafely(request, response, "pages/login");
    },

    /**
     * Handles request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    loginFormSubmitted: async function (request, response) {
        let domain = "@dewv.edu";

        if (request.body.username.indexOf("@") < 0 && request.body.username.slice(-domain.length) !== domain) {
            request.body.username = request.body.username + domain;
        }

        var result;
        // TODO .env flag for real/fake authentication; don't use node env
        if (request.app.get("env") === "production") {
            result = await _checkLdap(request.body.username, request.body.password);
        } else {
            result = _simulateAuthentication(request.body.username, request.body.password);
        }

        if (result instanceof ldap.InvalidCredentialsError) {
            response.locals.banner = "Invalid username and/or password.";
            return AuthController.logout(request, response);
        } else if (result instanceof ldap.InsufficientAccessRightsError) {
            response.locals.banner = "Sorry, you are not authorized to use this system.";
            return AuthController.logout(request, response);
        } else if (result instanceof ldap.UnavailableError) {
            sails.log.debug("appeal to security question");
            // LDAP is unavailable; appeal to security question
            return response.redirect("/nonexistentSecurityQuestionUrl"); // TODO
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

        if (request.session.role === "student") {
            request.session.defaultUrl = "/student/visit";
        } else if (request.session.role === "staff") {
            request.session.defaultUrl = "/visit";
        }

        request.session.save();
        return response.redirect(request.session.defaultUrl);
    },

    logout: async function (request, response) {
        request.session.destroy();
        return await sails.helpers.responseViewSafely(request, response, `pages/login`);
    }
};

async function _checkLdap(username, password) {
    const clientOptions = {
        url: "ldaps://DEDC-01.DEWV.EDU:636",
        timeout: 10 * 1000,
        connectTimeout: 10 * 1000,
        tlsOptions: {
            rejectUnauthorized: false
        },
    };

    return new Promise((resolve) => {
        var client = ldap.createClient(clientOptions);

        client.on("error", function (error) {
            _handleError(`LDAP client error handler: ${error.message}`);
        });

        client.on("connectError", function (error) {
            _handleError(`LDAP connectError handler: ${error.message}`);
        });

        client.on("connect", function (r, error) {
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
                var searchOptions = {
                    filter: `(userPrincipalName=${username})`,
                    scope: "sub",
                    attributes: ["dn", "givenName", "sn"]
                };

                client.search("DC=dewv,DC=edu", searchOptions, function (error, searchResponse) {
                    if (error) {
                        return _handleError(`LDAP client search: ${error.message}`);
                    }

                    searchResponse.on("error", function (error) {
                        _handleError(`LDAP search response error handler: ${error.message}`);
                    });

                    searchResponse.on("searchEntry", function (entry) {
                        client.unbind();

                        var ldapDn = entry.object.dn;
                        var result = {
                            firstName: entry.object.givenName,
                            lastName: entry.object.sn,
                            role: undefined
                        };
                        // TODO make session.role an object with boolean properties for roles

                        // TODO .env this
                        let ldapRoles = [{
                            dnContains: "OU=Students",
                            role: "student"
                        },
                        {
                            dnContains: "OU=Naylor_Center",
                            role: "staff"
                        },
                        {
                            dnContains: "CN=Mattingly",
                            role: "staff"
                        }
                        ];

                        // Set user role(s) based on LDAP distinguished name (dn).
                        for (const rule of ldapRoles) {
                            sails.log.debug(`Trying ${rule.dnContains} against ${ldapDn}`);
                            if (ldapDn.indexOf(rule.dnContains) >= 0) {
                                sails.log.debug(`Setting role ${rule.role}`);
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

function _simulateAuthentication(username, password) {
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

module.exports = AuthController;
