module.exports = async function(request, response, proceed) {

    if (request.session && request.session.userProfile) {
        return proceed();
    }

    sails.log.debug("request forbidden by policy isAuthenticated");
    return response.forbidden();
};
