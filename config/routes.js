let routes = {
    "/": "/student",
    
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",
    // "GET /staff/menu" 
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted"
};

module.exports.routes = routes;
