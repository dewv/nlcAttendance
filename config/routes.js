let routes = {
    "/": "/student",
    
    "GET /:model/new": "RestController.createFormRequested",
    "POST /:model": "RestController.createFormSubmitted",
    
    "GET /:model/:id/edit": "RestController.editFormRequested",
    "POST /:model/:id": "RestController.editFormSubmitted",
    
    "GET /visit/view": "RestController.returnVisitView",
    "GET /visit/view/:data" "RestController.returnVisitView",
    
    "GET /visit/export": "RestController.visitExport"
};

module.exports.routes = routes;
