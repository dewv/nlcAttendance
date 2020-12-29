/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */


module.exports.bootstrap = async function () {
    const regex = /:\/\/[^:]+:[^@]+@/;
    const redact = "://REDACTED:REDACTED@";

    if (sails.config.datastores.default.url) {
        sails.log.info(`Database: ${sails.config.datastores.default.url.replace(regex, redact)}`);
    }

    if (sails.config.session.url) {
        sails.log.info(`Session store: ${sails.config.session.url.replace(regex, redact)}`);
    }

    if (sails.config.environment !== "production") {
        // The following models should create reference records for use in all
        // setups, including production. For production deplyment they must
        // be created by one ad hoc launch of development-mode code (`sails lift`).
        // See https://sailsjs.com/documentation/concepts/deployment#?set-up-production-database-s-for-your-models
        await Major.createData();
        await Sport.createData();

        // The following flag will prevent creation of test data by ad hoc
        // `sails lift` launch that is setting up production data.
        if (sails.config.custom.createTestData !== false) {
            await Staff.createTestData();
            await Student.createTestData();
            await Visit.createTestData();
        }
    }
};
