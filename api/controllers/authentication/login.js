const ldap = require("ldapjs");

/**
 * Handles request to submit the login form.
 * @argument {external:Request} request -  The HTTP request.
 * @argument {external:Response} response - The HTTP response.
 * @public
 * @async
 */
module.exports = async function (request, response) {
    let domain = "@dewv.edu";
    if (request.body.username.indexOf("@") < 0 && request.body.username.slice(-domain.length) !== domain) {
        request.body.username = request.body.username + domain;
    }
    request.body.username = request.body.username.toLowerCase();
    let result;
    /* istanbul ignore if */
    if (sails.config.custom.ldap) {
        // result = await _ldapAuthentication(request.body.username, request.body.password);
        result = await sails.helpers.ldapAuthentication(request.body.username, request.body.password);
    } else {
        result = _simulatedAuthentication(request.body.username, request.body.password);
    }

    if (result instanceof ldap.InvalidCredentialsError) {
        request.session.banner = "Invalid username and/or password.";
        request.session.bannerClass = "alert-danger";
        return response.redirect("/logout");
    } else if (result instanceof ldap.InsufficientAccessRightsError) {
        request.session.banner = "Sorry, you are not authorized to use this system.";
        request.session.bannerClass = "alert-danger";
        return response.redirect("/logout");
    } else if (result instanceof ldap.UnavailableError) {
        request.session.banner = "There is a problem connecting to the college's directory server. Please notify helpdesk@dewv.edu.";
        request.session.bannerClass = "alert-danger";
        return response.redirect("/logout");
    }

    for (const property in result) {
        request.session[property] = result[property];
    }

    let newProfile = {
        username: request.body.username,
        firstName: request.session.firstName,
        lastName: request.session.lastName
    };

    if (request.session.role === "staff") newProfile.name = newProfile.firstName + " " + newProfile.lastName;

    let userProfile = await sails.models[request.session.role].findOrCreate({
        username: request.body.username
    }, newProfile);

    request.session.userId = userProfile.id;
    request.session.username = userProfile.username;

    if (request.session.role === "staff") {
        request.session.nextUrl = "/visit";
    } else if (request.session.role === "student") {
        request.session.forceProfileUpdate = userProfile.forceUpdate;
        request.session.visit = await sails.helpers.getLatestVisit(request.session.userId);
        if (request.session.forceProfileUpdate) request.session.nextUrl = `/student/${request.session.userId}/edit`;
        else if (request.session.visit.checkOutTime) request.session.nextUrl = "/visit/new";
        else request.session.nextUrl = `/visit/${request.session.visit.id}/edit`;
    }

    return response.redirect(request.session.nextUrl);
};

/**
 * Checks login credentials for development use.
 * @argument {string} username -  The submitted username.
 * @argument {string} password -  The submitted password.
 * @return {Object} A dictionary of user information, or an LDAP-defined Error object.
 * @private
 * @async
 */
function _simulatedAuthentication(username, password) {
    if (password === "student" || password === "staff") {
        return {
            role: password,
            firstName: "Firstname",
            lastName: "Lastname"
        };
    } else if (password === "neither") {
        return new ldap.InsufficientAccessRightsError();
    } else if (password === "noldap") {
        return new ldap.UnavailableError();
    }

    return new ldap.InvalidCredentialsError();
}
