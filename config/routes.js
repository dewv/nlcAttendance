let routes = {
    "/": "/login",
    
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",
    // "GET /staff/menu" 
    
    "GET /default": "RestController.createFormRequested", // TODO ? function won't be called cause of policies?
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted"
};

module.exports.routes = routes;
