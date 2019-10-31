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

    majorFormSubmitted: async function (request, response) {
        if(request.path === "/major") {
            request.session.Url = "/major"
            return RestController.createFormSubmitted(request, response);
        } else if (request.route.path === "/major/:id" && request.method === "POST") {
            request.session.Url = "/major"
            return RestController.editFormSubmitted(request, response);
        }
    },

    sportFormSubmitted: async function (request, response) {
        if(request.path === ("/springsport" || "/fallsport") && request.method === "POST") {
            request.session.Url = "/sports"
            return RestController.createFormSubmitted(request, response);
        } else if (request.route.path === ("/springsport/:id" || "fallsport/:id") && request.method === "POST") {
            request.session.Url = "/sports"
            return RestController.editFormSubmitted(request, response);
        }
    },

};
