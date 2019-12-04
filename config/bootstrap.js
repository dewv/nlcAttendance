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


module.exports.bootstrap = async function() {

    // By convention, this is a good place to set up fake data during development.
    await Major.createData();
    await FallSport.createData();
    await SpringSport.createData();
    await Student.createTestData();
    await Staff.createTestData();
    await Visit.createTestData();
};
