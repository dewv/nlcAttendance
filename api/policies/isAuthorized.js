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
 */module.exports = async function(request, response, proceed) {

    let model = request.params.model;
    let profileUrl = `/${request.session.role}/${request.session.userId}`;

    request.session.userProfile = await sails.helpers.populateOne(sails.models[request.session.role], request.session.userId);

    if (request.session.role === "student") {
        // TODO this is a temporary placeholder record; need to fetch real one
        request.session.userProfile.visit = {
            id: 1,
            checkInTime: new Date("2019-02-26T03:24:00"),
            checkOutTime: null, // new Date("2019-02-26T04:24:00"), 
            visitLength: null,
            visitPurpose: null,
            purposeAchieved: null,
            tutorCourses: null,
            comment: null,
            isLengthEstimated: false
        };
        sails.log.debug("set visit");
    }

    if (request.path === "/") {
        return proceed();
    }
    
    if (request.path === profileUrl ||
        request.path === `${profileUrl}/edit`) {
        // Users are authorized to access their own profile ...
        return proceed();
    }

    if (request.session.role === "student" && model === "visit") {
        let visitUrl = `/${model}/${request.session.userProfile.visit.id}`;
        if (request.path === visitUrl ||
            request.path === `${visitUrl}/edit`) {
            // Students are authorized to edit their own most recent visit record ...
            return proceed();
        }
        else if (request.path === "/visit/new") {
            // ... or to create a new visit record ...
            return proceed();
        }
    }

    if (request.session.role === "staff") {
        if (request.path === "/staffmenu" ||
            request.path === "/visit" || // view visits
            request.path === "/visit/spreadsheet" || // view visits spreadsheet dump
            request.path === "/browser") { // register browser to track visits
            return proceed();
        }
    }

    sails.log.debug("default to forbid for " + request.path);
    sails.log.debug(`role: ${request.session.role}`);
    return response.forbidden();
};
