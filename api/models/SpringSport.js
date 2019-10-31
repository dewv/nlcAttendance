/**
 * Represents a set of Spring sport records. 
 * @module 
 * @implements Model
 * @borrows SpringSportRecord as SpringSportRecord 
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
     * Indicates which model attributes are required when a user updates a spring sport.
     */
    inputRequired: {
        status: true,
    },
};

/**
 * A Spring sport record.
 * @typedef {Record} SpringSportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} status - Does the sport show up in select options.
 */
