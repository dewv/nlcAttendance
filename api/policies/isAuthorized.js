/**
 * @module
 */
/**
 * Enforces authorization rules. 
 * @function isAuthorized
 * @argument {external:Request} request - The HTTP request. 
 * @argument {external:Response} response - The HTTP response. 
 * @argument {function} proceed - The callback to indicate that the request should go through. 
 * @modifies The response, when the user's request is not authorized.
 * @async
 */
module.exports = async function (request, response, proceed) {
    let model = request.params.model;

    if (model === "controller") return proceed();

    let profileUrl = `/${request.session.role}/${request.session.userId}`;

    request.session.userProfile = await sails.helpers.populateOne(sails.models[request.session.role], request.session.userId);

    if (request.session.role === "student") {
        let visit = await Visit.find({ where: { student: request.session.userProfile.id }, limit: 1, sort: "checkInTime DESC" });
        if (visit[0]) {
            request.session.userProfile.visit = visit[0];
            request.session.userProfile.visit.checkedIn = (request.session.userProfile.visit.checkOutTime === null);
        }
        else {
            request.session.userProfile.visit = {
                id: undefined,
                checkedIn: false
            };
        }
    }

    // Users are authorized to access their own profile ...
    if (request.path === `${profileUrl}/edit` && request.method === "GET") return proceed();

    // Users are authorized to update their own profile ...
    if (request.path === profileUrl && request.method === "POST") return proceed();

    // A profile update may be required before the user can take any other action.
    if (request.session.userProfile.forceUpdate) {
        return response.redirect(`${profileUrl}/edit`);
    }

    // Student users are *required* to ...
    if (request.session.role === "student") {
        let checkInForm = "/visit/new";
        let checkOutForm = `/visit/${request.session.userProfile.visit.id}/edit`;
        if (request.session.userProfile.visit.checkedIn) {
            // ... check out when checked in.
            if (request.path === checkOutForm && request.method === "GET") return proceed();
            if (request.path === `/visit/${request.session.userProfile.visit.id}` && request.method === "POST") return proceed();
            return response.redirect(checkOutForm);
        } else {
            // ... check in when checked out.
            if (request.path === checkInForm && request.method === "GET") return proceed();
            if (request.path === "/visit" && request.method === "POST") return proceed();
            return response.redirect(checkInForm);
        }
    }
    
    // Staff users are authorized to ...
    if (request.session.role === "staff") {
        // ... view the staff menu.        
        if (request.path === "/staffmenu" && request.method === "GET") return proceed();
        // ... view the list of students.
        if (request.path === "/student" && request.method === "GET") return proceed();
        // ... view the list of visits.
        if (request.path === "/visit" && request.method === "GET") return proceed();
        // ... access and submit the form for registering the browser to track visits.
        if (request.path === "/browser") return proceed();
    }

    sails.log.debug(`default to forbid for ${request.session.role}, ${request.method} ${request.path}`);
    return response.forbidden();
};
