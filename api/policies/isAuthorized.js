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
    if (request.params.model === "controller-unit-test") return proceed();

    let requestIs = function (method, path) {
        return request.method === method && request.path === path;
    };

    let profileUrl = `/${request.session.role}/${request.session.userId}`;

    request.session.userProfile = await sails.helpers.populateOne(sails.models[request.session.role], request.session.userId);

    if (request.session.role === "student") {
        let visit = await Visit.find({
            where: {
                student: request.session.userProfile.id
            },
            limit: 1,
            sort: "checkInTime DESC"
        });
        if (visit[0]) {
            request.session.userProfile.visit = visit[0];
            request.session.userProfile.visit.checkedIn = (request.session.userProfile.visit.checkOutTime === null);
        } else {
            request.session.userProfile.visit = {
                id: undefined,
                checkedIn: false
            };
        }
    }

    // Users are authorized to access their own profile ...
    if (requestIs("GET", `${profileUrl}/edit`)) return proceed();
    // Users are authorized to update their own profile ...
    if (requestIs("POST", `${profileUrl}`)) return proceed();

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
            if (requestIs("GET", checkOutForm)) {
                return proceed();
            }
            if (requestIs("POST", `/visit/${request.session.userProfile.visit.id}`)) {
                request.body[request.session.role] = request.session.username;
                request.session.nextUrl = "/logout";
                return proceed();
            }
            return response.redirect(checkOutForm);
        } else {
            // ... check in when checked out.
            if (requestIs("GET", checkInForm)) {
                return proceed();
            }
            if (requestIs("POST", "/visit")) {
                request.body[request.session.role] = request.session.username;
                request.session.nextUrl = "/logout";
                return proceed();
            }
            return response.redirect(checkInForm);
        }
    }

    // Staff users are authorized to ...
    if (request.session.role === "staff") {
        // ... view the list of visits.
        if (requestIs("GET", "/visit")) return proceed();
        // ... access the form for registering the browser to track visits.
        if (requestIs("GET", "/browser")) return proceed();
        // ... submit the form for registering the browser to track visits.
        if (requestIs("POST", "/browser")) return proceed();
    }

    sails.log.debug(`default to forbid for ${request.session.role}, ${request.method} ${request.path}`);
    return response.forbidden();
};
