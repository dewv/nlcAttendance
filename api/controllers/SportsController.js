/**
 * Extends REST handling with custom logic for sports models. 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {

    /**
     * Handles an HTTP GET request for displaying all sports.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    getSports: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("SportsController", "getSports").end();
        let springSport = await sails.helpers.getRecordList(sails.models["springsport"], {});
        let fallSport = await sails.helpers.getRecordList(sails.models["fallsport"], {});
        return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`, {
            springSport: springSport,
            fallSport: fallSport,
        });
    },

    /**
     * Handles request to update or create a sport data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    sportFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("SportsController", "sportFormSubmitted").end();
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
