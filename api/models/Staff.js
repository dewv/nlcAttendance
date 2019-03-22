/**
 * Represents a set of staff profile records. 
 * @module 
 * @implements Model
 * @borrows StaffRecord as StaffRecord 
 */
module.exports = {

    attributes: {
        username: { type: "string", required: true, allowNull: false, unique: true },
        firstName: { type: "string", required: true, allowNull: false },
        lastName: { type: "string", required: true, allowNull: false },
        isSlpInstructor: { type: "boolean", allowNull: "false", defaultsTo: false },
        forceUpdate: { type: "boolean", defaultsTo: true }
    },
    
    candidateKey: "username",

    beforeUpdate: async function(valuesToSet, proceed) {
        valuesToSet.forceUpdate = false;
        return proceed();
    }
};

/**
 * A staff profile record.
 * @typedef {Record} StaffRecord
 * @property {string} username - The staff member's email address, @dewv.edu.
 * @property {string} firstName - The staff member's first name.
 * @property {string} lastName - The staff member's last name.
 * @property {boolean} isSlpInstructor - Indicates if the staff member is an SLP instructor. 
 * @property {boolean} forceUpdate=true - Indicates if it is mandatory for the student to update their profile. 
 */
