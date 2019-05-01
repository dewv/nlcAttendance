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
    createFormRequested: async function(request, response) {
        let model = sails.models[request.params.model];
        let domains = await sails.helpers.getDomains(model);
        let ejsData = {
            formData: await sails.helpers.getDefaults(model),
            action: "/" + request.params.model
        };

        for (let domain in domains) {
            ejsData[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain]);
        }
        console.log(JSON.stringify(ejsData));
        return sails.helpers.responseViewSafely(response, `pages/${request.params.model}/createForm`, ejsData);
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
        return response.redirect(`/${request.params.model}`);
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
    },
    
    //this is to be generalized and be capable of accepting a query string
    /*view: async function(request, response) {
        let model = sails.models[request.params.model];
        let Query;
        if(request.body){
            Query = await sails.models[request.params.model].find({firstName: request.body.query});
        }
        else{
            Query = null;
        }
        let ejsData = {
            action: `/${request.params.model}/view`,
            name: `${request.params.model}view`,
            Query 
        };
        return await sails.helpers.responseViewSafely(response, `pages/visit/view`, ejsData);
    }*/
    
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
    }
};
