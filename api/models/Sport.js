/**
 * A college sport. 
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        discontinued: { type: "string", defaultsTo: "No", isIn: ["Yes", "No"] },
    },

    getId: async function (name) {
        if (!name || !name.length) return null;

        let record = await Sport.findOne({ name: name });
        if (record) return record.id;

        return null;
    },

    getDefaults: function () {
        return {
            name: "",
            discontinued: Sport.attributes.discontinued.defaultsTo
        };
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
