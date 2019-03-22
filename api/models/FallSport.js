/**
 * Represents a set of Fall sport records. 
 * @module 
 * @implements Model
 * @borrows FallSportRecord as FallSportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true }
    },
    
    candidateKey: "name"
};

/**
 * A Fall sport record.
 * @typedef {Record} FallSportRecord
 * @property {string} name - The sport's name.
 */
