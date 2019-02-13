module.exports = async function(request, response, proceed) {

    // TODO
    // if authentication information is not in `request`
    // return response.redirect("/login");
    
    // temporary fake authentication info; 
    // something like this will be populated by real login code
    // details may change
    
    request.session.uid = 1;  // student or staff ID from database
    request.session.role = "student"; // type of user
    request.session.forceProfileUpdate = false; // mandatory profile update?
    request.session.visitId = 0; // ID of student's most recent visit
    request.session.isCheckedIn = false;
    
    console.log(JSON.stringify(request.session))
    
    return proceed();
};
