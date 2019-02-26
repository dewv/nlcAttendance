/**
 * Routes standard REST requests to the proper model's view.
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

        request.session.userProfile = await sails.models[request.session.role].findOrCreate(ldapData, ldapData);
        request.session.save();
        
        if (request.session.role === "student") {
            return response.redirect(`/student/${request.session.userProfile.id}/edit`); //("/visit/new");
        }
        
        return response.redirect("/staff/menu");
    },
    
    logout: function(request, response) {
        request.session.destroy();
        return response.redirect("/login");
    },

    /**
     * Handles request to display a form for editing a data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormRequested: async function(request, response) {
        let model = sails.models[request.params.model];
        let recordToUpdate = await sails.helpers.populateOne(model, request.params.id);
        if (!recordToUpdate) return response.notFound();
        let domains = await sails.helpers.getDomains(model);
        let ejsData = {
            formData: recordToUpdate,
            action: `/${request.params.model}/${request.params.id}`
        };

        for (let domain in domains) {
            let selected = undefined;
            if (recordToUpdate[domain]) {
                if (recordToUpdate[domain].name) {
                    selected = recordToUpdate[domain].name;
                }
                else {
                    selected = recordToUpdate[domain];
                }
            }
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain], selected);
        }

        return await sails.helpers.responseViewSafely(response, `pages/${request.params.model}/editForm`, ejsData);
    },

    /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function(request, response) {
        let encodedData = await sails.helpers.encodeAssociations(sails.models[request.params.model], request.body);
        await sails.models[request.params.model].updateOne({ id: request.params.id }).set(encodedData);
        return response.redirect(`/${request.params.model}/${request.params.id}`);
    }
};
