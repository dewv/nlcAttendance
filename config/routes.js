let routes = {
    // Authentication requests
    "GET /login": "AuthController.loginFormRequested",
    "POST /login": "AuthController.loginFormSubmitted",
    "GET /logout": "AuthController.logout",

    // Miscellaneous requests (not CRUD operations handled via REST)
    "GET /": "MiscController.get",
    "GET /browser": "MiscController.get",

    // Custom handling to combine sports seasons
    "GET /sports": "SportsController.listsRequested",

    // Default handling of CRUD operations via REST 
    "GET /:model": "RestController.listRequested",
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
};

module.exports.routes = routes;
