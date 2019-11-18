/**
 * Extends REST handling with custom logic for the major model. 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {

    /**
     * Handles request to create a major data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("MajorController", "createFormSubmitted").end();
        // If action is a create
        request.session.Url = "/major";
        request.params.model = "major";
        return RestController.createFormSubmitted(request, response);
    },

    /**
     * Handles request to update a major data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("MajorController", "editFormSubmitted").end();
        // If action is a edit
        request.session.Url = "/major";
        request.params.model = "major";
        return RestController.editFormSubmitted(request, response);
    },

};
