/** 
 * Base class for MVC controllers.
 * @abstract
 */
class Model {
    constructor() {

    }

    /**
     * @property {external:SailsModel} sails - The underlying sailsjs ORM model.
     * @public
     */
    get sails() {
        throw new Error(`Class '${this.constructor.name}' is a subclass of 'Model', and must implement abstract getter 'sails'.`);
    }

    /**
     * Generates a data record with blank or default values to populate create form.
     * @return {Object} a blank data record
     * @public
     */
    getBlank() {
        let result = {};
        for (let property in this.sails.attributes) {
            if (this.sails.attributes[property].defaultsTo) result[property] = this.attributes[property].defaultsTo;
            else if (this.sails.attributes[property].model) result[property] = { name: "Choose one ..." };
            else if (this.sails.attributes[property].type === "string") result[property] = "";
            else if (this.sails.attributes[property].type === "boolean") result[property] = false;
            else if (this.sails.attributes[property].type === "number") result[property] = 0;
            else if (this.sails.attributes[property].type === "ref") sails.log.warn("found ref: " + JSON.stringify(this.attributes[property]));
            else if (this.sails.attributes[property].type === "json") sails.log.warn("found json: " + JSON.stringify(this.attributes[property]));
        }
        return result;
    }

    /**
     * Provides domain values for each association.
     * @return {Object} a dictionary of associations and their domain values
     * @public
     * @async
     */
    async getAssociationDomains() {
        return {};
    }

    /**
     * Translates association values entered by user to database IDs.
     * @argument {Object} record - user-entered data values
     * @modifies the `record` argument
     * @public
     * @async
     * @abstract
     */
    async encodeAssociations(record) {
        throw new Error(`Class '${this.constructor.name}' is a subclass of 'Model', and must implement abstract method 'encodeAssociations'.`);
    }

    /**
     * Retrieves attributes and associations for a specified ID.
     * @argument {number} id - the specified ID
     * @return {Object} a data record
     * @public
     * @async
     * @abstract
     */
    async populateOne(id) {
        throw new Error(`Class '${this.constructor.name}' is a subclass of 'Model', and must implement abstract method 'populateOne'.`);
    }

}

module.exports = Model;

/**
 * The Waterline ORM Model defined by sailsjs.
 * @external SailsModel 
 * @see https://sailsjs.com/documentation/reference/waterline-orm/models
 */
 
/* global sails */