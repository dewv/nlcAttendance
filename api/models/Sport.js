/**
 * @module Sport
 * 
 * Usage: `Sport` or `sails.models.Sport`
 */
 
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true}
    }
};
