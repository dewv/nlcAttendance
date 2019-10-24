/**
 * Represents a set of academic major records. 
 * @module 
 * @implements Model
 * @borrows MajorRecord as MajorRecord 
 */
module.exports = {

    attributes: {
        name: { type: "string", required: true, unique: true,},
    },
    
    candidateKey: "name"
};

/**
 * An academic major record.
 * @typedef {Record} MajorRecord
 * @property {string} name - The major's name.
 */
