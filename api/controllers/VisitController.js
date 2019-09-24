/**
 * Extends REST handling with custom logic for visit creation (check in). 
 * @implements Controller
 * @module
 */

const RestController = require("./RestController");

module.exports = {
    /**
     * Handles request to create a new visit record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    createFormSubmitted: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("VisitController", "createFormSubmitted").end();

        // When a student creates a visit record (checks in), put student ID on the visit.
        if (request.session.role === "student") request.body.student = request.session.userId;
        
        // Now let REST controller take over.
        request.params.model = "visit";
        response.locals = response.locals || {};
        response.locals.banner = "You are now checked in. Please remember to check out before you leave.";
        response.locals.forceLogout = true;
        return RestController.createFormSubmitted(request, response);
    },
    
     /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    editFormSubmitted: async function(request, response) {
        if (request.params.model === "controller") return response.cookie("VisitController", "editFormSubmitted").end();
        response.locals = response.locals || {};
        response.locals.banner = "You are now checked out. Thanks for visiting Naylor Learning Center.";
        response.locals.forceLogout = true;
        return RestController.editFormRequested(request, response);
    }
};
