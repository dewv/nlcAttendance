let student = {
    attributes: {
        username: { type: 'string', required: true, allowNull: false },
        firstName: { type: 'string', required: true, allowNull: false },
        lastName: { type: 'string', required: true, allowNull: false },
        fallSport: { model: "Sport" },
        springSport: { model: "Sport" },
        classRank: {type: 'string', required: true, allowNull: false },
        majors: {model: "Major"},
        residentialStatus: {type: 'string', required: true, allowNull: false},
    },
};

module.exports = student;

