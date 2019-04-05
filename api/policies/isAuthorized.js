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
module.exports = async function(request, response, proceed) {

    let model = request.params.model;
    let profileUrl = `/${request.session.role}/${request.session.userId}`;

    request.session.userProfile = await sails.helpers.populateOne(sails.models[request.session.role], request.session.userId);

    if (request.session.role === "student") {
        let visit = await Visit.find({ where: { name: request.session.userProfile.id }, limit: 1, sort: "checkInTime DESC" });
        if (visit.id) {
            request.session.userProfile.visit = {
                id: visit[0].id,
                checkInTime: visit[0].checkInTime,
                checkOutTime: visit[0].checkOutTime,
                visitLength: visit[0].visitLength,
                visitPurpose: visit[0].visitPurpose,
                purposeAchieved: visit[0].purposeAchieved,
                tutorCourses: visit[0].tutorCourses,
                comment: visit[0].comment,
                isLengthEstimated: visit[0].isLengthEstimated,
            };
        }
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
        if (request.path === "/visit/new") {
            // ... or to create a new visit record ...
            return proceed();
        }
        else if (request.path === `/${model}/${request.session.userProfile.visit.id}` ||
            request.path === `${visitUrl}/edit`) {
            // Students are authorized to edit their own most recent visit record ...
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
