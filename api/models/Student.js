let student = {
    attributes: {
        username: { type: 'string', required: true, allowNull: false },
        firstName: { type: 'string', required: true, allowNull: false },
        lastName: { type: 'string', required: true, allowNull: false },
        fallSport: { model: "Sport" },
        springSport: { model: "Sport" },
        classRank: {model: "ClassRank" },
        majors: {model: "Majors"},
    },
};

module.exports = student;

