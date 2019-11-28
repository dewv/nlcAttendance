module.exports = {
    friendlyName: "Get domains",

    description: "Provides domain values for each relevant attribute, based on association or validations.",

    inputs: {
        model: {
            description: "A Sails model whose relevant attributes are keys in the result dictionary.",
            type: "ref",
            required: true
        },
        recordToUpdate: {
            description: "A record whose values should be selected in the update form",
            type: "ref",
            required: false
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Domains",
        }
    },

    fn: async function (inputs, exits) {
        let domains = {};
        if (inputs.model.domainDefined) {
            for (let property in inputs.model.domainDefined) {
                domains[property] = { options: [] };
                if (inputs.model.inputRequired[property]) { domains[property].inputRequired = true; }
                /* istanbul ignore else */
                if (sails.helpers.isAssociation(inputs.model, property)) {
                    domains[property].options = await sails.models[inputs.model.attributes[property].model].find().sort("name ASC");
                }
                else if (inputs.model.attributes[property].validations &&
                    inputs.model.attributes[property].validations.isIn) {
                    // domains[property].options = [];
                    for (let i = 0; i < inputs.model.attributes[property].validations.isIn.length; i++) {
                        domains[property].options.push({ name: inputs.model.attributes[property].validations.isIn[i] });
                    }
                }
                else {
                    sails.log.warn(`Unable to find domain values for ${inputs.model.identity}.${property}`);
                }
            }
        }

        let result = {};
        for (let domain in domains) {
            let selected = undefined;
            if (inputs.recordToUpdate && inputs.recordToUpdate[domain]) {
                if (inputs.recordToUpdate[domain].name) {
                    selected = inputs.recordToUpdate[domain].name;
                } else {
                    selected = inputs.recordToUpdate[domain];
                }
            }
            result[domain] = await sails.helpers.generateHtmlSelect(domain, domains[domain], selected);
        }

        return exits.success(result);
    }
};
