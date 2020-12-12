/**
 * @module
 */
/**
 * Enforces authentication.
 * @function isAuthenticated
 * @argument {external:Request} request - The HTTP request.
 * @argument {external:Response} response - The HTTP response.
 * @argument {function} proceed - The callback to indicate that the request should go through.
 * @modifies The response, when the user is not authenticated.
 * @async
 */
module.exports = async function (request, response, proceed) {
    if (request.session && request.session.role) {
        request.session.path = request.path;
        return proceed();
    }

    return response.redirect("/login");
};
