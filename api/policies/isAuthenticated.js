module.exports = async function(request, response, proceed) {

    if (request.session && request.session.role) {
        return proceed();
    }

    sails.log.debug("request forbidden by policy isAuthenticated");
    return response.forbidden();
};
