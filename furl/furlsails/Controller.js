/** 
 * Base class for MVC controllers.
 * @abstract
 */
class Controller {
    constructor(serviceName, model, views) {
        this._serviceName = serviceName;
        this._model = model;
        this._views = views;
        
        this.routes = {};

        let rest = `GET /${serviceName}/new`;
        this.routes[rest] = (request, response) => { return this.createFormRequested(request, response); };

        rest = `POST /${serviceName}`;
        this.routes[rest] = (request, response) => { return this.createFormSubmitted(request, response); };

        rest = `GET /${serviceName}/:id/edit`;
        this.routes[rest] = (request, response) => { return this.editFormRequested(request, response); };

        rest = `POST /${serviceName}/:id`;
        this.routes[rest] = (request, response) => { return this.editFormSubmitted(request, response); };
    }

    /** 
     * Add this controller's routes to a specified set of routes.
     * @argument [Object] existingRoutes - The specified set of existing routes.
     * @modifies existingRoutes argument
     * @public
     */
    addRoutes(existingRoutes) {
        for (let route in this.routes) {
            existingRoutes[route] = this.routes[route];
        }
    }

    /**
     * Handles request to display a form for entering a new data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    async createFormRequested(request, response) {
        let domains = await this._model.getAssociationDomains();
        this._views.createFormRequested(request, response, this._model.getBlank(), domains);
    }

    /**
     * Handles request to create a new data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    async createFormSubmitted(request, response) {
        await this._model.encodeAssociations(request.body);

        await this._model.sails.create(request.body);

        this._views.createFormSubmitted(request, response);
    }

    /**
     * Handles request to display a form for editing a data record.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    async editFormRequested(request, response) {
        let recordToUpdate = await this._model.populateOne(request.params.id);
        if (!recordToUpdate) return response.notFound();

        let domains = await this._model.getAssociationDomains();
        this._views.editFormRequested(request, response, recordToUpdate, domains);
    }

    /**
     * Handles request to update a data record using form data.
     * @argument {external:Request} request -  The HTTP request.
     * @argument {external:Response} response - The HTTP response.
     * @public
     * @async
     */
    async editFormSubmitted(request, response) {
        await this._model.encodeAssociations(request.body);
        await this._model.sails.updateOne({ id: request.params.id }).set(request.body);

        this._views.editFormSubmitted(request, response);
    }
}

module.exports = Controller;
