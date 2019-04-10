let routes = {
    "/": "/student",
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
    //probably want to change route name, but this works for now.
    "/:model/view": "RestController.visitView",
    "POST /:model/view": "RestController.updateView"
                    
    
};

module.exports.routes = routes;
