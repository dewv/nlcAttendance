/**
 * Represents a set of academic major records. 
 * @module 
 * @implements Model
 * @borrows MajorRecord as MajorRecord 
 */
module.exports = {

    attributes: {
        name: { type: "string", required: true, unique: true,},
        status: {type: "string", required: true, isIn: ["Yes", "No"]},
    },
    
    candidateKey: "name",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        status: true,
    },

    /** 
     * Indicates which model attributes are required when a user updates a major.
     */
    inputRequired: {
        status: true,
    },
};

/**
 * An academic major record.
 * @typedef {Record} MajorRecord
 * @property {string} name - The major's name.
 * @property {boolean} status - Does the major show up in select options.
 */
