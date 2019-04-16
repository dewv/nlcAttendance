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
    }
};
