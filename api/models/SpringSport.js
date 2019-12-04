/**
 * Represents a set of Spring sport records. 
 * @module 
 * @implements Model
 * @borrows SpringSportRecord as SpringSportRecord 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true,},
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
     * Indicates which model attributes are required when a user updates a spring sport.
     */
    inputRequired: {
        discontinued: true,
    },

    createData: async function() {
        let springSports = {
            name: [
                "Acrobatics and Tumbling",
                "Baseball",
                "Men's Lacrosse",
                "Women's Lacrosse",
                "Softball",
                "Men's Tennis",
                "Women's Tennis",
                "Track and Field",
                "Triathlon"
            ]
        };

        for (let i = 0; i < springSports.name.length(); i++) {
            await SpringSport.create({ name: springSports.name[i],})
        };
    },
};

/**
 * A Spring sport record.
 * @typedef {Record} SpringSportRecord
 * @property {string} name - The sport's name.
 * @property {boolean} discontinued - Does the sport show up in select options.
 */
