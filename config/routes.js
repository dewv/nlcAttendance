let routes = {
    "/": "/student",
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
    "/visit/view": "RestController.visitView",
    "POST /visit/view": "RestController.updateView"
                    
    
};

module.exports.routes = routes;
