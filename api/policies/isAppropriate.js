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
    // A profile update may be required before the user can take any other action.
    let profileUrl = `/${request.session.role}/${request.session.userProfile.id}`;
    let profileEditUrl = `${profileUrl}/edit`;
    if (request.path === profileUrl || request.path === profileEditUrl) {
        return proceed();
    }

    if (request.session.userProfile.forceUpdate) {
        return response.redirect(`${profileEditUrl}`);
    }

    if (request.session.role === "student") {
        // The app always determines student destination.
        // If not forced to update user profile by logic above,
        // they are sent to Check In or Check Out, as appropriate.
        let checkInUrl = "/visit/new";
        let checkOutUrl = `/visit/${request.session.userProfile.visit.id}/edit`;
        let nowCheckedIn = request.session.userProfile.visit.checkOutTime === "0000-00-00 00:00:00";

        if (nowCheckedIn) {
            if (request.path === checkOutUrl) {
                return proceed();
            }
            else {
                return response.redirect(`${checkOutUrl}`);
            }
        }
        else {
            if (request.path === checkInUrl) {
                return proceed();
            }
            else {
                return response.redirect(`${checkInUrl}`);
            }
        }
    }
    else if (request.session.role === "staff" && request.path === "/") {
        // Path / is a default; menu is the default page for staff users.
        return response.redirect("/staffmenu");
    }

    // Proceed by default (e.g., staff menu links).
    return proceed();
};
