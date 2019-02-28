module.exports = async function(request, response, proceed) {
    // This policy implements "workflow" business rules. 
    // It assumes that the user is authenticated, and authorized to make the pending request. 
    // The question here is: do certain data circumstances dictate redirecting the user?

    // A profile update may be required before the user can take any other action.
    let profileUrl = `/${request.session.role}/${request.session.userProfile.id}`;
    let profileEditUrl = `${profileUrl}/edit`;
    if (request.path === profileUrl || request.path === profileEditUrl) {
        return proceed();
    }

    if (request.session.userProfile.forceUpdate) {
        sails.log.debug("Redirecting to user profile");
        return response.redirect(`${profileEditUrl}`);
    }

    if (request.session.role === "student") {
        let checkInUrl = "/visit/new";
        let checkOutUrl = `/visit/${request.session.userProfile.visit.id}/edit`;
        let nowCheckedIn = request.session.userProfile.visit.checkOutTime === null;

        if (nowCheckedIn) {
            if (request.path === checkOutUrl) {
                return proceed();
            }
            else {
                sails.log.debug("Redirecting to check out");
                return response.redirect(`${checkOutUrl}`);
            }
        }
        else {
            if (request.path === checkInUrl) {
                return proceed();
            }
            else {
                sails.log.debug("Redirecting to check in");
                return response.redirect(`${checkInUrl}`);
            }
        }
    }
    else if (request.session.role === "staff" && request.path === "/") {
        return response.redirect("/staffmenu");
    }

    return proceed();
};
