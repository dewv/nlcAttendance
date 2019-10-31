/**
 * Routes miscellaneous requests, mapping request paths to the `pages/misc` folder.
 * Functionally equivalent to Sails routing's view target syntax, but policies are applied.
 * @see https://sailsjs.com/documentation/concepts/routes/custom-routes#?view-target-syntax
 * @implements Controller
 * @module
 */
module.exports = {
    /**
     * Handles an HTTP GET request.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    get: async function(request, response) {
        return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`);
    },

    /**
     * Handles an HTTP GET request for displaying all sports.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    getSports: async function(request, response) {
        let springSport = await sails.helpers.getRecordList(sails.models["springsport"], {});
        let fallSport = await sails.helpers.getRecordList(sails.models["fallsport"], {});
        return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`, {
            springSport: springSport,
            fallSport: fallSport,
        });
    },
};
