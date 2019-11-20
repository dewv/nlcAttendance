/**
 * Represents a set of academic major records. 
 * @module 
 * @implements Model
 * @borrows MajorRecord as MajorRecord 
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
     * Indicates which model attributes are required when a user updates a major.
     */
    inputRequired: {
        discontinued: true,
    },
};

/**
 * An academic major record.
 * @typedef {Record} MajorRecord
 * @property {string} name - The major's name.
 * @property {boolean} discontinued - Indicates if the major has been discontinued.
 */
