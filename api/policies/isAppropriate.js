module.exports = async function(request, response, proceed) {
    // This policy implements "workflow" business rules. 
    // It assumes that the user is authenticated, and authorized to make the pending request. 
    // The question here is: do certain data circumstances dictate redirecting the user?

    // A profile update may be required before the user can take any other action.
    let profileUrl = `/${request.session.role}/${request.session.userProfile.id}/edit`;
    if (request.session.userProfile.forceUpdate && request.url !== profileUrl) {
        return response.redirect(profileUrl);
    }

    if (request.session.role === "student") {
        let checkInUrl = "/visit/new";
        let checkOutUrl = `/visit/${request.session.userProfile.visit.id}/edit`;
        let nowCheckedOut = request.session.userProfile.visit.checkOutTime === null;

        if (request.url === checkInUrl && !nowCheckedOut) {
            // Student cannot check in when already checked in.
            return response.redirect(checkOutUrl);
        }

        if (request.url === checkOutUrl && nowCheckedOut) {
            // Student cannot check out when already checked out.
            return response.redirect(checkInUrl);
        }
    }

    return proceed();
};
