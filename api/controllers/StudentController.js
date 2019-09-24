/**
 * Extends REST handling with custom logic for student check in/out. 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {
    /**
     * Determines where to route requests coming from student users. 
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    visitFormRequested: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("StudentController", "visitFormRequested").end();

        /* 
         * Based on checked in/out status, determine which action is appropriate:
         *   when checked in, should edit existing record to check out;
         *   when checked out, should create new vist to check in.
         * Then let REST controller handle it.
        */
        request.params.model = "visit";
        
        if (request.session.userProfile.visit.checkedIn) {
            request.params.id = request.session.userProfile.visit.id;
            return RestController.editFormRequested(request, response);
        }
        else {
            return RestController.createFormRequested(request, response);
        }
    },

     /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("StudentController", "editFormSubmitted").end();
        response.locals = response.locals || {};
        response.locals.banner = "Your student profile was updated.";
        return RestController.editFormRequested(request, response);
    }
};
