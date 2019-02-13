module.exports = async function(request, response, proceed) {

    let model = request.params.model;

    if (model === "student" || model === "staff") {
        if (request.url === `/${model}/${request.session.uid}/edit`) {
            // Users are authorized to edit their own profile ...
            return proceed();
        }
        else {
            // ... but nothing else on the two user profile models.
            return response.forbidden();
        }
    }
    else if (model === "visit") {
        if (request.session.role === "student") {
            if (request.url === `/visit/${request.session.visitId}/edit`) {
                // Students are authorized to edit their own most recent visit record ...
                return proceed();
            }
            else if (request.url === "/visit/new") {
                // ... or to create a new visit record ...
                return proceed();
            }
            else {
                // ... but not anything else on Visit model.
                return response.forbidden();
            }

        }
        else if (request.session.role === "staff") {
            if (request.url === "/visit" || // view visits
                request.url === "/visit/spreadsheet" || // view visits spreadsheet dump
                request.url === "/visit/browser") { // register browser to track visits
                return proceed();
            }
            else {
                return request.forbidden();
            }
        }
    }

    // TODO this is open by default; would prefer closed by default, but there will probably be various incidental pages for success/error pages, etc.
    return proceed();
};
