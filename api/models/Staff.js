/**
 * Staff.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        username: { type: "string", required: true, allowNull: false, unique: true },
        firstName: { type: "string", required: true, allowNull: false },
        lastName: { type: "string", required: true, allowNull: false },
        isSlpInstructor: { type: "boolean", allowNull: "false", defaultsTo: false },
        forceUpdate: { type: "boolean", defaultsTo: true }
    },
};
