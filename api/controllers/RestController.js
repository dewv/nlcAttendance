/**
 * RestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 * 
 * A generic controller for routing standard REST requests to the proper model's view.
 * 
 */

module.exports = {
    /**
     * Handles request to display a form for entering a new data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormRequested: async function(request, response) {
        let model = sails.models[request.params.model];
        let domains = await sails.helpers.getAssociationDomains(model);
        let ejsData = {
            formData: await sails.helpers.getBlankRecord(model),
            action: "/" + request.params.model
        };

        for (let domain in domains) {
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain]);
        }

        response.view(`pages/${request.params.model}/createForm`, ejsData);
    },

    /**
     * Handles request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormSubmitted: async function(request, response) {
        let encodedData = await sails.helpers.encodeAssociations(sails.models[request.params.model], request.body);
        await sails.models[request.params.model].create(encodedData);
        response.redirect(`/${request.params.model}`);
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
        let domains = await sails.helpers.getAssociationDomains(model);
        let ejsData = {
            formData: recordToUpdate,
            action: `/${request.params.model}/${request.params.id}`
        };

        for (let domain in domains) {
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain], recordToUpdate[domain] === null ? undefined : recordToUpdate[domain].name);
        }

        response.view(`pages/${request.params.model}/editForm`, ejsData);
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
        response.redirect(`/${request.params.model}/${request.params.id}`);
    }

};
