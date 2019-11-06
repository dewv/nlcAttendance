/**
 * Extends REST handling with custom logic for the major model. 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {

    /**
     * Handles request to update or create a major data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    majorFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("MajorController", "majorFormSubmitted").end();
        // If action is a create
        if (request.path === "/major") {
            request.session.Url = "/major";
            request.params.model = "major";
            return RestController.createFormSubmitted(request, response);
        }
        // If action is a edit
        request.session.Url = "/major";
        request.params.model = "major";
        return RestController.editFormSubmitted(request, response);
    },

};