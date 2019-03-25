/**
 * Represents a set of Spring sport records. 
 * @module 
 * @implements Model
 * @borrows SpringSportRecord as SpringSportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true}
    },
    
    candidateKey: "name"
};

/**
 * A Spring sport record.
 * @typedef {Record} SpringSportRecord
 * @property {string} name - The sport's name.
 */
