module.exports = {
    friendlyName: "Download a list of Visit records",

    description: "Controller action for GETting a download of Visit model records.",

    inputs: {
    },

    exits: {
        success: {
            description: "Download all visit records."
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let response = this.res;
        if (request.session.role !== "staff") throw "unauthorized";

        let modelName = "visit";
        let model = sails.models[modelName];

        let records = await sails.helpers.getRecordList(model, "id DESC");

        let download = "";
        let headings = "";
        let firstPass = true;
        for (let record of records) {
            for (let field in record) {
                if (field === "createdAt" || field === "updatedAt") continue;
                if (record[field] && record[field].username) {
                    // associated student record
                    if (firstPass) headings += `"username","firstName", "lastName",`;
                    download += `"${record[field].username}","${record[field].firstName}","${record[field].lastName}",`;
                } else {
                    if (firstPass) headings += `"${field}",`;
                    download += `"${record[field] === null ? "" : record[field]}",`;
                }
            }
            download += "\n";
            firstPass = false;
        }

        return exits.success(response.set({ "Content-Type": "text/csv", "Content-Disposition": "filename=\"visits.csv\"" }).send(`${headings}\n${download}`));
    }
};
