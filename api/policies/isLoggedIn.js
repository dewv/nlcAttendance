/*
 * @module isLoggedIn
 */
 
module.exports = async function(request, response, proceed) {

    // TODO
    // if authentication information is not in `request`
    // return response.redirect("/login");
    return proceed();
};
