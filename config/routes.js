let routes = {
    // Authentication
    "GET /login": { view: "pages/authentication/loginForm" },
    "POST /login": { controller: "authentication", action: "login" },
    "GET /logout": { controller: "authentication", action: "logout" },

    // Misc
    "GET /": "/login",
    "GET /browser/register": { controller: "browser", action: "register" },
    "GET /version.txt": function(request, response) {
        return response.send(require('../package.json').version);
    },

    // Major
    "GET /major/new": { controller: "major", action: "get-create-form" },
    "POST /major": { controller: "major", action: "post-create-data" },
    "GET /major": { controller: "major", action: "get-list" },
    "GET /major/:id": { response: "forbidden" },
    "GET /major/:id/edit": { response: "forbidden" },
    "POST /major/:id": { controller: "major", action: "post-update-data" },
    "POST /major/:id/delete": { response: "forbidden" },

    // Sport
    "GET /sport/new": { controller: "sport", action: "get-create-form" },
    "POST /sport": { controller: "sport", action: "post-create-data" },
    "GET /sport": { controller: "sport", action: "get-list" },
    "GET /sport/:id": { response: "forbidden" },
    "GET /sport/:id/edit": { response: "forbidden" },
    "POST /sport/:id": { controller: "sport", action: "post-update-data" },
    "POST /sport/:id/delete": { response: "forbidden" },

    // Staff
    "GET /staff/new": { response: "forbidden" },
    "POST /staff": { response: "forbidden" },
    "GET /staff": { response: "forbidden" },
    "GET /staff/:id": { response: "forbidden" },
    "GET /staff/:id/edit": { controller: "staff", action: "get-update-form" },
    "POST /staff/:id": { controller: "staff", action: "post-update-data" },
    "POST /staff/:id/delete": { response: "forbidden" },

    // Student
    "GET /student/new": { response: "forbidden" },
    "POST /student": { response: "forbidden" },
    "GET /student": { response: "forbidden" },
    "GET /student/:id": { response: "forbidden" },
    "GET /student/:id/edit": { controller: "student", action: "get-update-form" },
    "POST /student/:id": { controller: "student", action: "post-update-data" },
    "POST /student/:id/delete": { response: "forbidden" },

    // Visit
    "GET /visit/new": { controller: "visit", action: "get-create-form" },
    "POST /visit": { controller: "visit", action: "post-create-data" },
    "GET /visit": { controller: "visit", action: "get-list" },
    "GET /visit/:id": { response: "forbidden" },
    "GET /visit/:id/edit": { controller: "visit", action: "get-update-form" },
    "POST /visit/:id": { controller: "visit", action: "post-update-data" },
    "POST /visit/:id/delete": { response: "forbidden" },
    "GET /visit/download": { controller: "visit", action: "download" }
};

module.exports.routes = routes;
