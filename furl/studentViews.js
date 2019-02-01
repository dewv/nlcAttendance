const Views = require("./furlsails/Views");

/**
 * Manages MVC views for the Student service.
 */
class StudentViews extends Views {
    constructor() {
        super();
        this._filePath = "pages/studentForm";
        this._baseUrl = "/student";
    }

    /** override */
    createFormRequested(request, response, blankRecord, domains) {
        let ejsData = {
            formData: blankRecord,
            action: this._baseUrl,
            buttonLabel: "Create",
        };

        for (let domain in domains) {
            ejsData[domain] = this._generateHtmlSelect(domain, domains[domain], "name");
        }

        response.view(this._filePath, ejsData);
    }

    /** override */
    createFormSubmitted(request, response) {
        response.redirect(this._baseUrl);
    }

    /** override */
    editFormRequested(request, response, record, domains) {
        let ejsData = {
            formData: record,
            action: this._baseUrl + "/" + record.id,
            buttonLabel: "Update",
        };

        for (let domain in domains) {
            ejsData[domain] = this._generateHtmlSelect(domain, domains[domain], "name", record[domain] === null ? null : record[domain].name);
        }

        if (response.view) {
            response.view(this._filePath, ejsData);
        }
        else {
            // test only: no `view` method in mock express response    
            require("ejs").renderFile("views/" + this._filePath + ".html", ejsData, function(error, result) {
                if (error) {
                    console.log(JSON.stringify(error));
                    return error;
                }
                response.end(result);
            });
        }
    }

    /** override */
    editFormSubmitted(request, response) {
        response.redirect(this._baseUrl + "/" + request.params.id);
    }
}

module.exports = new StudentViews();
