const ldap = require("ldapjs");
/**
 * Routes login and logout requests. 
 * @implements Controller
 * @module
 */
module.exports = {
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
        if (true || request.app.get("env") === "production") {
            // try to authenticate via LDAP
            result = await _checkLdap(request.body.username, request.body.password);
            if (result instanceof ldap.InvalidCredentialsError) {
                response.locals.banner = "Invalid username and/or password.";
                return response.redirect("/login");
            } else if (result instanceof ldap.ConnectionError || result instanceof ldap.UnavailableError) {
                response.locals.banner = "TODO cannot access LDAP server";
                sails.log.debug("do alt auth")
                // LDAP is unavailable; appeal to security question
                return response.redirect("/altauth");
            } else if (result instanceof Error) {
                response.locals.banner = result.message;
                return response.redirect("/login");
            }
        } else {
            // Simulate authentication 
            if (request.body.password === "student" || request.body.password === "staff") {
                result = {
                    role: request.body.password,
                    firstName: "First",
                    lastName: "Last"
                };
            } else {
                // TODO Why do banners not display?
                response.locals.banner = "Invalid username and/or password.";
                return response.redirect("/login");
            }
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

    logout: function (request, response) {
        request.session.destroy();
        return response.redirect("/login");
    }
};

async function _checkLdap(username, password) {
    const failMessage = "Due to technical difficulties, we cannot verify your username/password at this time.";

    const clientOptions = {
        url: "ldaps://DEDC-01.DEWV.EDU:636",
        timeout: 10 * 1000,
        connectTimeout: 10 * 1000,
        tlsOptions: {
            rejectUnauthorized: false
        },
    };

    // TODO returns
    return new Promise((resolve, reject) => {
        var client = ldap.createClient(clientOptions);

        _handleFailure("testing", new ldap.ConnectionError())

        client.on("error", function (error) {
            // Defensive programming: not clear when/why ldapjs might emit this.
            sails.log.warn(`LDAP client error handler: ${error.message}`);
            reject(new Error(failMessage));
        });

        client.on("connectError", function () {
            sails.log.warn(`LDAP connect error handler`);
            resolve(new ldap.UnavailableError());
            return; // Not sure why this is needed, but it is.
        });

        client.on("connect", function (r, error) {
            sails.log.debug("on connect");
            if (error) {
                sails.log.warn(`LDAP connect handler: ${error.message}`);
                reject(new Error(failMessage));
            }

            client.bind(username, password, function (error) {
                if (error) {
                    // Caller will handle some errors. 
                    if (error instanceof ldap.ConnectionError ||
                        error instanceof ldap.UnavailableError ||
                        error instanceof ldap.InvalidCredentialsError) {
                        resolve(error);
                    }
                    // Defensive programming, in case of other ldapjs errors.
                    sails.log.warn(`LDAP user bind: ${error}`);
                    reject(new Error(failMessage));
                }

                // Authentication was successful. Get information about user. 
                var searchOptions = {
                    filter: `(userPrincipalName=${username})`,
                    scope: "sub",
                    attributes: ["dn", "givenName", "sn"]
                };

                client.search("DC=dewv,DC=edu", searchOptions, function (error, searchResponse) {
                    if (error) {
                        // Defensive programming: not clear when/why ldapjs might error here.
                        sails.log.warn(`LDAP client search: ${error}`);
                        reject(new Error(failMessage));
                    }

                    searchResponse.on("error", function (error) {
                        // Defensive programming: not clear when/why ldapjs might emit this.
                        sails.log.warn(`LDAP search response error handler: ${error}`);
                        reject(new Error(failMessage));
                    });

                    searchResponse.on("searchEntry", function (entry) {
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
                        if (!result.role) resolve(new Error("You do not appear to be a D&E student or a Naylor Center staff member."));

                        client.unbind();

                        resolve(result);
                    });
                });
            });
        });

        function _handleError(message, error) {
            // Defensive programming: not clear when/why ldapjs might error here.
            sails.log.warn(`${message}: ${error.message}`);
            reject(new Error(failMessage));
        }
    });
}
