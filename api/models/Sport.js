/**
 * Represents a set of Sport records. 
 * @module 
 * @implements Model
 * @borrows SportRecord as SportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        discontinued: { type: "string", required: true, isIn: ["Yes", "No"] },
    },

    candidateKey: "name",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        discontinued: true,
    },

    /** 
     * Indicates which model attributes are required when a user updates a fall sport.
     */
    inputRequired: {
        discontinued: true,
    },
};

/**
 * A Sport record.
 * @typedef {Record} SportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} discontinued - Indicates whether the sport has been discontinued.
 */
