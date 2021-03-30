module.exports = {
    friendlyName: "Get a list of Visit records",

    description: "Controller action for GETting a list of Visit model records.",

    inputs: {},

    exits: {
        html: {
            description: "Display a view with the records list.",
            responseType: "view",
            viewTemplatePath: "pages/visit/index",
        },
        json: {
            description: "Respond with JSON data for visit records",
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden",
        },
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        if (request.session.role !== "staff") throw "unauthorized";

        if (request.headers.accept === "application/json") {
            let page = request.query.page;
            if (isNaN(page)) page = 1;
            let limit = request.query.limit;
            if (isNaN(limit)) limit = 10;
            let skip = (page - 1) * limit;

            let records = await Visit.find()
                .sort("checkInTime DESC")
                .populate("student")
                .skip(skip)
                .limit(limit);

            let results = {
                total: await Visit.count(),
                data: [],
            };

            let date = new Intl.DateTimeFormat("en-us", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            });

            for (let i = 0; i < records.length; i++) {
                let visit = records[i];
                results.data.push({
                    id: results.total - skip - i,
                    student:
                        records[i].student.firstName +
                        " " +
                        records[i].student.lastName,
                    checkIn: records[i].checkInTime
                        ? date.format(records[i].checkInTime)
                        : "",
                    checkOut: records[i].checkOutTime
                        ? date.format(records[i].checkOutTime)
                        : "",
                    visitLength: records[i].checkOutTime
                        ? records[i].length
                        : "",
                    isLengthEstimated: records[i].checkOutTime
                        ? records[i].isLengthEstimated
                            ? "Yes"
                            : "No"
                        : "",
                });
            }

            return exits.json(results);
        }

        let ejsData = {
            session: request.session,
            records: [],
        };

        return exits.html(ejsData);
    },
};
