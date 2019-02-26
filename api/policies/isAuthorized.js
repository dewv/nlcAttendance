module.exports = async function(request, response, proceed) {

    let model = request.params.model;
    let profileUrl = `/${request.session.role}/${request.session.userProfile.id}`;

    if (request.url === profileUrl ||
        request.url === `${profileUrl}/edit`) {
        // Users are authorized to access their own profile ...
        return proceed();
    }
    else if (model === "visit") {
        if (request.session.role === "student") {
            let visitUrl = `/${model}/${request.session.userProfile.visit.id}`;
            if (request.url === visitUrl ||
                request.url === `${visitUrl}/edit`) {
                // Students are authorized to edit their own most recent visit record ...
                return proceed();
            }
            else if (request.url === "/visit/new") {
                // ... or to create a new visit record ...
                return proceed();
            }

        }
        else if (request.session.role === "staff") {
            if (request.url === "/visit" || // view visits
                request.url === "/visit/spreadsheet" || // view visits spreadsheet dump
                request.url === "/visit/browser") { // register browser to track visits
                return proceed();
            }
        }
    }

    return response.forbidden();
};
