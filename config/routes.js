let routes = {
    // Authentication requests
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",
    
    // Miscellaneous requests
    "GET /": "MiscController.get",
    "GET /staffmenu": "MiscController.get",
    "GET /browser": "MiscController.get",
    "GET /default": "MiscController.get",
    
    // Custom logic to determine which form to show to student
    "GET /student/visit": "StudentController.visitFormRequested",
    
    // RESTful API for sails models
    "GET /:model": "RestController.listRequested", 
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted"
};

module.exports.routes = routes;
