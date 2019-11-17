let routes = {
    // Authentication requests
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",
    
    // Miscellaneous requests (not CRUD operations handled via REST)
    "GET /": "MiscController.get",
    "GET /staffmenu": "MiscController.get",
    "GET /browser": "MiscController.get",
    "GET /default": "MiscController.get",
    
    // Custom logic to extend default REST handling of CRUD operations 
    "POST /visit": "VisitController.createFormSubmitted",
    "POST /visit/:id": "VisitController.editFormSubmitted",
    
    // Default handling of CRUD operations via REST 
    "GET /:model": "RestController.listRequested", 
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
};

module.exports.routes = routes;
