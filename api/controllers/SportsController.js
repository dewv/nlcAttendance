/**
 * Extends REST handling with custom logic for sports models. 
 * @implements Controller
 * @module
 */
module.exports = {
    /**
     * Handles an HTTP GET request for lists of all sports-- one list per season. 
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    listsRequested: async function (request, response) {
        if (request.params.model === "controller") return response.cookie("SportsController", "listsRequested").end();
        let springSportList = await sails.helpers.getRecordList(sails.models.springsport);
        let fallSportList = await sails.helpers.getRecordList(sails.models.fallsport);
        return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`, {
            springSport: springSportList,
            fallSport: fallSportList,
        });
    }
};
