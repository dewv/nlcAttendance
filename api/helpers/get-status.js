const ldap = require("ldapjs");

module.exports = {
    friendlyName: "Get application status info",

    description: "Returns details of application status and configuration.",

    inputs: {},

    exits: {
        success: {
            description: "All done.",
        },
    },

    fn: async function (inputs, exits) {
        let status = {
            version: require("../../package.json").version,
            db: "sails-disk",
            sessionStore: "sails",
            ldapConnected: false
        };

        const regex = /:\/\/[^:]+:[^@]+@/;
        const redact = "://REDACTED:REDACTED@";

        if (sails.config.datastores.default.url) {
            status.db = sails.config.datastores.default.url.replace(regex, redact);
        }

        if (sails.config.session.url) {
            status.sessionStore = sails.config.session.url.replace(regex, redact);
        }

        if (sails.config.custom.ldap) {
            const result = await sails.helpers.ldapAuthentication("InvalidUsername", "InvalidPassword");
            status.ldapConnected = result instanceof ldap.InvalidCredentialsError;
        }

        return exits.success(status);
    }
};
