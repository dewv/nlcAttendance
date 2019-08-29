/**
 * TODO 
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

        request.params.model = "visit";
        if (request.session.userProfile.visit.checkedIn) {
            request.params.id = request.session.userProfile.visit.id;
            return RestController.editFormRequested(request, response);
        }
        else {
            return RestController.createFormRequested(request, response);
        }
    }
};
