module.exports = async function(request, response, proceed) {

    if (request.session && request.session.role) {
        return proceed();
    }

    return response.redirect("/login");
    // sails.log.debug("request forbidden by policy isAuthenticated");
    // return response.forbidden();
};
