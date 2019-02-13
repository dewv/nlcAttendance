let routes = {
    "/": "/student",
    
    // "GET /login"
    // "POST /login"    should redirect students to check in, staff to menu
    // "GET /logout"
    // "GET /staff/menu" 
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted"
};

module.exports.routes = routes;
