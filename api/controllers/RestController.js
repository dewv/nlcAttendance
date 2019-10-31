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
    listRequested: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "listRequested").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let records = await sails.helpers.getRecordList(model, {});
        return sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/index`, {
            records: records
        });
    },

    /**
   * Handles request to display a form for entering a new data record.
   * @argument {external:Request} request -  The HTTP request.
   * @argument {external:Response} response - The HTTP response.
   * @public
   * @async
   */
    createFormRequested: async function (request, response) {
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

        return sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/createForm`, ejsData);
    },

    /**
   * Handles request to create a new data record using form data.
   * @argument {external:Request} request -  The HTTP request.
   * @argument {external:Response} response - The HTTP response.
   * @public
   * @async
   */
    createFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "createFormSubmitted").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let encodedData = await sails.helpers.encodeAssociations(model, request.body);
        await model.create(encodedData);
        if (response.locals.forceLogout) return this.forceLogout(request, response);
        if (request.session.Url) return response.redirect(request.session.Url);
        return response.redirect(request.session.defaultUrl);
    },

    /**
   * Handles request to display a form for editing a data record.
   * @argument {external:Request} request -  The HTTP request.
   * @argument {external:Response} response - The HTTP response.
   * @public
   * @async
   */
    editFormRequested: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "editFormRequested").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
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
                } else {
                    selected = recordToUpdate[domain];
                }
            }
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain], selected);
        }

        return await sails.helpers.responseViewSafely(request, response, `pages/${request.params.model}/editForm`, ejsData);
    },

    /**
   * Handles request to update a data record using form data.
   * @argument {external:Request} request -  The HTTP request.
   * @argument {external:Response} response - The HTTP response.
   * @public
   * @async
   */
    editFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("RestController", "editFormSubmitted").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let encodedData = await sails.helpers.encodeAssociations(model, request.body);
        await model.updateOne({
            id: request.params.id
        }).set(encodedData);
        if (response.locals.forceLogout) return this.forceLogout(request, response);
        if (request.session.Url) return response.redirect(request.session.Url);
        return response.redirect(request.session.defaultUrl);
    },

    /**
   * Destroys session information and redirects to login page. 
   * @argument {external:Request} request -  The HTTP request.
   * @argument {external:Response} response - The HTTP response.
   * @public
   * @async
   */
    forceLogout: async function (request, response) {
        request.session.destroy();
        return await sails.helpers.responseViewSafely(request, response, `pages/login`);
    }
};
