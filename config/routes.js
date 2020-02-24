let routes = {
    // Authentication 
    "GET /login": { view: "pages/authentication/loginForm" },
    "POST /login": { controller: "authentication", action: "login" },
    "GET /logout": { controller: "authentication", action: "logout" },
    "GET /authentication/question": { controller: "authentication", action: "authenticate-by-security-questions"},

    // Misc 
    "GET /": "/login",
    "GET /browser/register": { controller: "browser", action: "register" },

    // Major 
    "GET /major/new": { controller: "major", action: "get-create-form" },
    "POST /major": { controller: "major", action: "post-create-data" },
    "GET /major": { controller: "major", action: "get-list" },
    "GET /major/:id": { response: "badRequest" },
    "GET /major/:id/edit": { response: "badRequest" },
    "POST /major/:id": { controller: "major", action: "post-update-data" },
    "POST /major/:id/delete": { response: "badRequest" },

    // Sport 
    "GET /sport/new": { controller: "sport", action: "get-create-form" },
    "POST /sport": { controller: "sport", action: "post-create-data" },
    "GET /sport": { controller: "sport", action: "get-list" },
    "GET /sport/:id": { response: "badRequest" },
    "GET /sport/:id/edit": { response: "badRequest" },
    "POST /sport/:id": { controller: "sport", action: "post-update-data" },
    "POST /sport/:id/delete": { response: "badRequest" },

    // Staff 
    "GET /staff/new": { response: "badRequest" },
    "POST /staff": { response: "badRequest" },
    "GET /staff": { response: "badRequest" },
    "GET /staff/:id": { response: "badRequest" },
    "GET /staff/:id/edit": { controller: "staff", action: "get-update-form" },
    "POST /staff/:id": { controller: "staff", action: "post-update-data" },
    "POST /staff/:id/delete": { response: "badRequest" },

    // Student
    "GET /student/new": { response: "badRequest" },
    "POST /student": { response: "badRequest" },
    "GET /student": { response: "badRequest" },
    "GET /student/:id": { response: "badRequest" },
    "GET /student/:id/edit": { controller: "student", action: "get-update-form" },
    "POST /student/:id": { controller: "student", action: "post-update-data" },
    "POST /student/:id/delete": { response: "badRequest" },

    // Visit 
    "GET /visit/new": { controller: "visit", action: "get-create-form" },
    "POST /visit": { controller: "visit", action: "post-create-data" },
    "GET /visit": { controller: "visit", action: "get-list" },
    "GET /visit/:id": { response: "badRequest" },
    "GET /visit/:id/edit": { controller: "visit", action: "get-update-form" },
    "POST /visit/:id": { controller: "visit", action: "post-update-data" },
    "POST /visit/:id/delete": { response: "badRequest" },
    "GET /visit/download": { controller: "visit", action: "download" }
};

module.exports.routes = routes;
