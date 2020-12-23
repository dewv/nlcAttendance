/**
 * Staging environment settings
 * (sails.config.*)
 *
 * The configuration in this file is only used when you lift your app using:
 *
 * ```
 * NODE_ENV=staging node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

module.exports = {
    datastores: {
        default: {
            adapter: "sails-mongo",
            url: "mongodb://atlas:atlas@cluster0-shard-00-00.dso9n.mongodb.net:27017,cluster0-shard-00-01.dso9n.mongodb.net:27017,cluster0-shard-00-02.dso9n.mongodb.net:27017/nlcAttendance?ssl=true&replicaSet=atlas-87jum1-shard-0&authSource=admin&retryWrites=true&w=majority"
        },

    },

    // models: {
    //     attributes: {
    //         id: { type: "string", columnName: "_id", },
    //     },
    // },

    //    blueprints: {
    //         shortcuts: false,
    //     },

    //    security: {
    //        cors: {
    //             // allowOrigins: [
    //             //   'https://example.com',
    //             // ]
    //         },

    //     },

    //    session: {
    //        adapter: "@sailshq/connect-redis",
    //        cookie: {
    //             secure: true,
    //         },

    //     },
    //    sockets: {

    //        // onlyAllowOrigins: [
    //         //   'https://example.com',
    //         //   'https://staging.example.com',
    //         // ],


    //     },

    //    log: {
    //         level: "debug"
    //     },



    //     http: {

    //        cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    //        trustProxy: true,

    //     },



    //     /**************************************************************************
    //   *                                                                         *
    //   * Lift the server on port 80.                                             *
    //   * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
    //   * probably don't need to set a port here, because it is oftentimes        *
    //   * handled for you automatically.  If you are not sure if you need to set  *
    //   * this, just try deploying without setting it and see if it works.)       *
    //   *                                                                         *
    //   ***************************************************************************/
    //     // port: 80,



    //     /**************************************************************************
    //   *                                                                         *
    //   * Configure an SSL certificate                                            *
    //   *                                                                         *
    //   * For the safety of your users' data, you should use SSL in production.   *
    //   * ...But in many cases, you may not actually want to set it up _here_.    *
    //   *                                                                         *
    //   * Normally, this setting is only relevant when running a single-process   *
    //   * deployment, with no proxy/load balancer in the mix.  But if, on the     *
    //   * other hand, you are using a PaaS like Heroku, you'll want to set up     *
    //   * SSL in your load balancer settings (usually somewhere in your hosting   *
    //   * provider's dashboard-- not here.)                                       *
    //   *                                                                         *
    //   * > For more information about configuring SSL in Sails, see:             *
    //   * > https://sailsjs.com/config/*#?sailsconfigssl                          *
    //   *                                                                         *
    //   **************************************************************************/
    //     // ssl: undefined,



    //     /**************************************************************************
    //   *                                                                         *
    //   * Production overrides for any custom settings specific to your app.      *
    //   * (for example, production credentials for 3rd party APIs like Stripe)    *
    //   *                                                                         *
    //   * > See config/custom.js for more info on how to configure these options. *
    //   *                                                                         *
    //   ***************************************************************************/
    //     custom: {
    //         // internalEmailAddress: "support@example.com",
    //         // mailgunDomain: 'mg.example.com',
    //         // mailgunSecret: 'key-prod_fake_bd32301385130a0bafe030c',
    //         // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //         //--------------------------------------------------------------------------
    //         // /\   OR, to avoid checking them in to version control, you might opt to
    //         // ||   set sensitive credentials like these using environment variables.
    //         //
    //         // For example:
    //         // ```
    //         // sails_custom__mailgunDomain=mg.example.com
    //         // sails_custom__mailgunSecret=key-prod_fake_bd32301385130a0bafe030c
    //         // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    //         // ```
    //         //--------------------------------------------------------------------------

    //     },
};
