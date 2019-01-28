const studentController = require("../furl/studentController");

let routes = {
  '/': '/student'
};

studentController.addRoutes(routes);

module.exports.routes = routes;
