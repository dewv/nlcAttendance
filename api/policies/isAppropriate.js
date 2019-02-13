module.exports = async function(request, response, proceed) {

    // This policy implements "workflow" business rules. 
    // It assumes that the user is authenticated, and authorized to make the pending request. 
    // The question here is: where should we send the user, based on certain data states?

    // TODO some of these redirects will cause errors until the corresponding MVC are complete
    
    let editProfileUrl = `/${request.session.role}/${request.session.uid}/edit`;

    if (request.url === editProfileUrl) {
        return proceed(); // We always allow user to update profile ...
    }

    if (request.session.forceProfileUpdate) {
        return response.redirect(editProfileUrl); // ... and sometimes force it.
    }

    if (request.session.role === "student") {
        let checkInUrl = "/visit/new";
        let checkOutUrl = `/visit/${request.session.visitId}/edit`;

        if (request.url === checkInUrl && request.session.isCheckedIn) {
            // Student cannot check in when already checked in.
            return response.redirect(checkOutUrl);
        }

        if (request.url === checkOutUrl && !request.session.isCheckedIn) {
            // Student cannot check out when already checked out.
            return response.redirect(checkInUrl);
        }
    }

    return proceed();
};
