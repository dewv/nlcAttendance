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
        if (request.path === "/staffmenu") {
            let ejsData = {
                userId: request.session.userId,
            }
            return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`, ejsData);
        } else if (request.path === "/spreadsheet") {
            let model = "visit";
            let name = request.query.name;
            let Query;
            //move this into a helper
            if(name === null || name === "") {
                Query = await model.find();
            }
            else {
                Query = await model.find({firstName: studentId});
            }
            
            let ejsData = {
                action: `/${request.params.model}/view`,
                name: `${request.params.model}view`,
                Query //this might change
            };
            return sails.helpers.responseViewSafely(response, `pages/misc${request.path}`, ejsData);
        }
        return sails.helpers.responseViewSafely(request, response, `pages/misc${request.path}`);
    }
};
