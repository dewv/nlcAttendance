/**
 * Extends REST handling with custom logic for staff users. 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {
    /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("StaffController", "editFormSubmitted").end();
        response.locals = response.locals || {};
        response.locals.banner = "Your staff profile was updated.";
        request.params.model = "staff";
        return RestController.editFormSubmitted(request, response);
    },

    editMajorFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("StaffController", "editMajorFormSubmitted").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let encodedData = await sails.helpers.encodeAssociations(model, request.body);
        await model.updateOne({
            id: request.params.id
        }).set(encodedData);

        if (response.locals.forceLogout) return this.forceLogout(request, response);
        return response.redirect("/major");
    },

    editSportFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("StaffController", "editMajorFormSubmitted").end();
        let model = sails.models[request.params.model];
        if (!model) return response.notFound();
        let encodedData = await sails.helpers.encodeAssociations(model, request.body);
        await model.updateOne({
            id: request.params.id
        }).set(encodedData);

        if (response.locals.forceLogout) return this.forceLogout(request, response);
        return response.redirect("/sports");
    },
    
};
