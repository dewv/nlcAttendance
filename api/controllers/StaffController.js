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
        request.session.Url = request.session.defaultUrl;
        request.params.model = "staff";
        return RestController.editFormSubmitted(request, response);
    },

    /**
     * Handles request to update or create a major data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    majorFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("StaffController", "majorFormSubmitted").end();
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

    /**
     * Handles request to update or create a sport data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    sportFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("StaffController", "sportFormSubmitted").end();
        request.session.Url = "/sports";
        // If action is a create on spring sport
        if (request.path === "/springsport") {
            request.params.model = "springsport";
            return RestController.createFormSubmitted(request, response);
        }
        // If action is a create on fall sport 
        if (request.path === "/fallsport") {
            request.params.model = "fallsport";
            return RestController.createFormSubmitted(request, response);
        }
        // If action is a edit on spring sport
        if (request.route.path === "/springsport/:id") {
            request.params.model = "springsport";
            return RestController.editFormSubmitted(request, response);
        }
        // If action is a edit on fall sport
        request.params.model = "fallsport";
        return RestController.editFormSubmitted(request, response);
    },

};
