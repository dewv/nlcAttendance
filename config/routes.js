let routes = {
    // Authentication requests
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",
    
    // Miscellaneous requests (not CRUD operations handled via REST)
    "GET /": "MiscController.get",
    "GET /browser": "MiscController.get",
    "GET /default": "MiscController.get",
    
    
    // Custom logic to extend default REST handling of CRUD operations 
    "GET /student/visit": "StudentController.visitFormRequested",
    "POST /visit": "VisitController.createFormSubmitted",
    "POST /student/:id": "StudentController.editFormSubmitted",
    "POST /visit/:id": "VisitController.editFormSubmitted",
    "POST /staff/:id": "StaffController.editFormSubmitted",
    "POST /major": "MajorController.createFormSubmitted",
    "POST /major/:id": "MajorController.editFormSubmitted",
    "GET /sports": "SportsController.getSports",
    "POST /fallsport": "SportsController.createFormSubmitted",
    "POST /fallsport/:id": "SportsController.editFormSubmitted",
    "POST /springsport": "SportsController.createFormSubmitted",
    "POST /springsport/:id": "SportsController.editFormSubmitted",
     
    // Default handling of CRUD operations via REST 
    "GET /:model": "RestController.listRequested", 
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
};

module.exports.routes = routes;
