/**
 * Represents a set of Fall sport records. 
 * @module 
 * @implements Model
 * @borrows FallSportRecord as FallSportRecord 
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
 * A Fall sport record.
 * @typedef {Record} FallSportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} discontinued - Indicates whether the sport has been discontinued.
 */
