const Controller = require("./furlsails/Controller");
const studentModel = require("./studentModel");
const studentViews = require("./studentViews");

/** 
 * An MVC controller.
 */
class StudentController extends Controller {
    constructor() {
        super("student", studentModel, studentViews);
    }
}

module.exports = new StudentController();
