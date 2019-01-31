/**
 * Base class for MVC views.
 * @abstract
 */
class Views {
    constructor() {

    }

    /**
     * Sends response for request to display a form for entering a new data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @argument {Object} blankRecord - The data to display in the form.
     * @argument {Object} domains - A dictionary of domains from associated models. 
     * @public
     */
    createFormRequested(request, response, blankRecord, domains) {
        response.notFound();
    }

    /**
     * Sends response for request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     */
    createFormSubmitted(request, response) {
        response.notFound();
    }

    /**
     * Sends response for request to display a form for editing a data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @argument {Object} record - The data to display in the form.
     * @argument {Object} domains - A dictionary of domains from associated models. 
     * @public
     */
    editFormRequested(request, response, record, domains) {
        response.notFound();
    }

    /**
     * Sends response for request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     */
    editFormSubmitted(request, response) {
        response.notFound();
    }

    /**
     * Generates an HTML <select> tag with specified <option>s. 
     * @argument {string} htmlName - Value to be used for the <select>'s name and id attributes.
     * @argument {[Object]} domain - Array of objects containing the <option>s that should appear in the <select>.
     * @argument {string} property - Name of the property to extract from domain objects.
     * @argument {string} selected - The option value that should be selected.
     * @return {string} HTML for a <select> tag.
     * @protected
     */
    _generateHtmlSelect(htmlName, domain, property, selected) {
        let result = "<select id=\"" + htmlName + "\" name=\"" + htmlName + "\"> <option>Choose one ...</option> ";
        for (let i = 0; i < domain.length; i++) {
            result += "<option value=\"" + domain[i][property] + "\"";
            if (selected && selected === domain[i][property]) result += " selected";
            result += ">" + domain[i][property] + "</option> ";
        }

        result += "</select>";
        return result;
    }

}

/**
 * The current HTTP request.
 * @external Request
 * @see https://sailsjs.com/documentation/reference/request-req
 */

/**
 * The HTTP response under construction. 
 * @external Response
 * @see https://sailsjs.com/documentation/reference/response-res 
 */

module.exports = Views;
