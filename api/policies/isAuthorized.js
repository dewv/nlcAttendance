/**
 * @module
 */
const mysql = require("mysql");
/**
 * Enforces authorization rules. 
 * @function isAuthorized
 * @argument {external:Request} request - The HTTP request. 
 * @argument {external:Response} response - The HTTP response. 
 * @argument {function} proceed - The callback to indicate that the request should go through. 
 * @modifies The response, when the user's request is not authorized.
 * @async
 */
module.exports = async function(request, response, proceed) {

    let model = request.params.model;
    let profileUrl = `/${request.session.role}/${request.session.userId}`;

    request.session.userProfile = await sails.helpers.populateOne(sails.models[request.session.role], request.session.userId);

    if (request.session.role === "student") {
        // TODO this is a temporary placeholder record; need to fetch real one
        let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "nlcAttendance",
        });
        let visit;
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM visit WHERE name = " + request.session.userId + ";", function(err, result, fields) {
                if (err) throw err;
                console.log(result);
                if (result.length > 1) {
                    for (let i = 0; i < result.length; i++) {

                        if (!visit) {
                            let a = result[i];
                            let b = result[i + 1];
                            a = new Date(a.checkInTime);
                            a = a.getTime();
                            b = new Date(b.checkInTime);
                            b = b.getTime();
                            if (a > b) {
                                visit = result[i];
                            }
                            else {
                                visit = result[i + 1];
                            }
                            i++;
                        }
                        else {
                            let a = result[i];
                            a = new Date(a.checkInTime);
                            a = a.getTime();
                            let b = new Date(visit.checkInTime);
                            b = b.getTime();
                            if (b <= a) {
                                visit = result[i];
                            }
                        }
                    }
                }
                else if (result.length === 1) {
                    visit = result[0];
                }
                else if (result.length === 0) {
                    visit = null;
                }
                console.log("MOST RECENT " + visit.checkInTime); //visit is not being updated outside of the query.
            });
            //visit is undefined here console.log("MOST RECENT " + visit.checkInTime);
        });
        request.session.userProfile.visit = {
            id: visit.id, //visit is undefined here
            checkInTime: visit.checkInTime,
            checkOutTime: visit.checkOutTime, // new Date("2019-02-26T04:24:00"), 
            visitLength: visit.visitLength,
            visitPurpose: visit.visitPurpose,
            purposeAchieved: visit.purposeAchieved,
            tutorCourses: visit.tutorCourses,
            comment: visit.comment,
            isLengthEstimated: visit.isLengthEstimated,
            
        };
        sails.log.debug("set visit");
    }

    if (request.path === "/") {
        return proceed();
    }

    if (request.path === profileUrl ||
        request.path === `${profileUrl}/edit`) {
        // Users are authorized to access their own profile ...
        return proceed();
    }

    if (request.session.role === "student" && model === "visit") {
        let visitUrl = `/${model}/${request.session.userProfile.visit.id}`;
        if (request.path === visitUrl ||
            request.path === `${visitUrl}/edit`) {
            // Students are authorized to edit their own most recent visit record ...
            return proceed();
        }
        else if (request.path === "/visit/new") {
            // ... or to create a new visit record ...
            return proceed();
        }
    }

    if (request.session.role === "staff") {
        if (request.path === "/staffmenu" ||
            request.path === "/visit" || // view visits
            request.path === "/visit/spreadsheet" || // view visits spreadsheet dump
            request.path === "/browser") { // register browser to track visits
            return proceed();
        }
    }

    sails.log.debug("default to forbid for " + request.path);
    sails.log.debug(`role: ${request.session.role}`);
    return response.forbidden();
};
