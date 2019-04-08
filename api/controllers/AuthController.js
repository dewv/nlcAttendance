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
    loginFormRequested: async function(request, response) {
        return sails.helpers.responseViewSafely(response, "pages/login");
    },

    /**
     * Handles request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    loginFormSubmitted: async function(request, response) {
        let authenticated = false;
        let ldapData = {};

        if (request.app.get("env") === "production") {
            // TODO real LDAP authentication
        }
        else if (request.body.password === "student" || request.body.password === "staff") {
            // simulate authentication in dev environment 
            authenticated = true;
            request.session.role = request.body.password;
            ldapData.username = request.body.username;
            ldapData.firstName = "First";
            ldapData.lastName = "Last";
        }

        if (!authenticated) return response.redirect("/login");

        let userProfile = await sails.models[request.session.role].findOrCreate({ username: request.body.username }, ldapData);
        request.session.userId = userProfile.id;
        request.session.username = userProfile.username;
        request.session.save();
        
        return response.redirect("/");
    },

    logout: function(request, response) {
        request.session.destroy();
        return response.redirect("/login");
    },
};
