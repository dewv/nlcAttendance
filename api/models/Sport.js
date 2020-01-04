/**
 * Represents a set of Sport records. 
 * @module 
 * @implements Model
 * @borrows SportRecord as SportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        discontinued: { type: "string", defaultsTo: "No", isIn: ["Yes", "No"] },
    },

    candidateKey: "name",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        discontinued: true,
    },

    /** 
     * Indicates which model attributes are required when a user updates a sport.
     */
    inputRequired: {
        discontinued: true,
    },

    /**
     * Creates records for each sport
     */
    createData: async function () {
        let sports = [
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
            "Acrobatics and Tumbling",
            "Baseball",
            "Men's Lacrosse",
            "Women's Lacrosse",
            "Softball",
            "Men's Tennis",
            "Women's Tennis",
            "Track and Field",
            "Triathlon"
        ];

        for (let i = 0; i < sports.length; i++) {
            await Sport.create({ name: sports[i] });
        }
    },
};

/**
 * A Sport record.
 * @typedef {Record} SportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} discontinued - Indicates whether the sport has been discontinued.
 */
