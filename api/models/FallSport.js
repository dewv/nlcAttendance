/**
 * Represents a set of Fall sport records. 
 * @module 
 * @implements Model
 * @borrows FallSportRecord as FallSportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        status: {type: "string", required: true, isIn: ["Enabled", "Disabled"]},
    },
    
    candidateKey: "name",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        status: true,
    },

    /** 
     * Indicates which model attributes are required when a user updates a fall sport.
     */
    inputRequired: {
        status: true,
    },
};

/**
 * A Fall sport record.
 * @typedef {Record} FallSportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} status - Does the sport show up in select options.
 */
