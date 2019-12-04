/**
 * Represents a set of Fall sport records. 
 * @module 
 * @implements Model
 * @borrows FallSportRecord as FallSportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        discontinued: {type: "string", defaultsTo: "No", isIn: ["Yes", "No"]},
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

    /**
     * Creates records for each fall sport
     */
    createData: async function() {
        let fallSports = [
            "Men's Basketball",
            "Women's Basketball",
            "Men's Cross Country",
            "Women's Cross Country",
            "Golf",
            "Men's Soccer",
            "Women's Soccer",
            "Men's Swimming",
            "Women's Swimming",
            "Volleyball",
            "Wrestling",
        ];

        for (let i = 0; i < fallSports.length; i++) {
            await FallSport.create({ name: fallSports[i] });
        }
    },
};

/**
 * A Fall sport record.
 * @typedef {Record} FallSportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} discontinued - Does the sport show up in select options.
 */
