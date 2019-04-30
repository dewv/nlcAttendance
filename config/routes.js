let routes = {
    "/": "/student",
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
    "GET /:model/view": "RestController.view",
    "POST /:model/view": "RestController.view"
    
};

module.exports.routes = routes;
