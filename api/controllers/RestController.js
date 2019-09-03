/**
 * Routes standard REST requests to the proper model's view.
 * @implements Controller
 * @module
 */
module.exports = {
    /**
     * Handles request to display a list of data records.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    listRequested: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "listRequested").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let records = await model.find();
        clearRestCookies(response);
        return sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/index`, { records: records });
    },

    /**
     * Handles request to display a form for entering a new data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormRequested: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "createFormRequested").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let domains = await sails.helpers.getDomains(model);
        let ejsData = {
            formData: await sails.helpers.getDefaults(model),
            action: "/" + request.params.model
        };

        for (let domain in domains) {
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain]);
        }

        clearRestCookies(response);
        return sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/createForm`, ejsData);
    },

    /**
     * Handles request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormSubmitted: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "createFormSubmitted").end();
        let encodedData = await sails.helpers.encodeAssociations(sails.models[request.params.model], request.body);
        await sails.models[request.params.model].create(encodedData);
        response.cookie("restAction", "create");
        response.cookie("restModel", request.params.model);
        return response.redirect(request.session.defaultUrl);
    },

    /**
     * Handles request to display a form for editing a data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormRequested: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "editFormRequested").end();
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

        clearRestCookies(response);
        return await sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/editForm`, ejsData);
    },

    /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "editFormSubmitted").end();
        let encodedData = await sails.helpers.encodeAssociations(sails.models[request.params.model], request.body);
        await sails.models[request.params.model].updateOne({ id: request.params.id }).set(encodedData);
<<<<<<< HEAD
        response.cookie("restAction", "edit");
        response.cookie("restModel", request.params.model);
        return response.redirect(request.session.defaultUrl);
=======
        return response.redirect(`/${request.params.model}/${request.params.id}`);
    },

    /**
     * Handles request to update view page.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    view: async function(request, response) {
        let model = sails.models[request.params.model];
        let name = request.query.name;
        let Query;
        //move this into a helper
        if(name === null || name === "") {
            Query = await model.find();
        }
        else {
            Query = await model.find({firstName: name});
        }
        
        let ejsData = {
            action: `/${request.params.model}/view`,
            name: `${request.params.model}view`,
            Query //this might change
        };
        return await sails.helpers.responseViewSafely(response, `pages/${request.params.model}/view`, ejsData); //generalize page request (This will require a convention fix with the folder/file name)
>>>>>>> master
    }
};

function clearRestCookies(response) {
    response.clearCookie("restAction");
    response.clearCookie("restModel");
}
