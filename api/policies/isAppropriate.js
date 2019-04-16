/**
 * @module
 */

/**
 * Implements "workflow" business rules. 
 * This policy assumes that the user is authenticated, and authorized to make the pending request. 
 * The question here is: do workflow rules dictate redirecting the request?
 * @function isAppropriate
 * @argument {external:Request} request - The HTTP request. 
 * @argument {external:Response} response - The HTTP response. 
 * @argument {function} proceed - The callback to indicate that the request should go through. 
 * @modifies The response sent to the user, by redirecting when appropriate.
 * @async
 */
module.exports = async function(request, response, proceed) {
    if (request.params.model === "controller") return proceed();
    
    let profileUrl = `/${request.session.role}/${request.session.userProfile.id}`;
    let profileEditUrl = `${profileUrl}/edit`;

    // A user may always update their profile.
    if (request.path === profileUrl || request.path === profileEditUrl) {
        return proceed();
    }

    // A profile update may be required before the user can take any other action.
    if (request.session.userProfile.forceUpdate) {
        return response.redirect(profileEditUrl);
    }

    if (request.session.role === "student") {
        // The app always determines student destination.
        // If not sent to update user profile by logic above,
        // they must Check In or Check Out, as appropriate.

        let checkInUrl = "/visit/new";

        // A student with no records must Check In
        if (!request.session.userProfile.visit) {
            if (request.path === checkInUrl) return proceed();
            return response.redirect(checkInUrl);
        }

        // Proper destination is determined by most recent visit record.
        let checkOutUrl = `/visit/${request.session.userProfile.visit.id}/edit`;
        let nowCheckedIn = request.session.userProfile.visit.checkOutTime === null;

        if (nowCheckedIn) {
            // Allow them to access check out form.
            if (request.path === checkOutUrl) return proceed();

            // Allow them to submit check out form.
            if (request.method === "POST" && request.path === `/visit/${request.session.userProfile.visit.id}`) {
                request.body.name = request.session.username; // TODO this is a kludge to make POST work
                return proceed();
            }

            // Redirect any other request to check out form.
            return response.redirect(checkOutUrl);
        }
        else {
            // Allow them to access check in form.
            if (request.path === checkInUrl) return proceed();

            // Allow them to submit check in form.
            if (request.method === "POST" && request.url === "/visit") {
                request.body.name = request.session.username; // TODO this is a kludge to make POST work
                return proceed();
            }

            // Redirect any other request to check in form.
            return response.redirect(checkInUrl);
        }
    }

    if (request.session.role === "staff" && request.path === "/") {
        // Controllers will redirect to / in order to allow policies to determine destination.
        // Staff are sent to a menu by default.
        return response.redirect("/staffmenu");
    }

    // Proceed by default (e.g., staff menu links).
    return proceed();
};
