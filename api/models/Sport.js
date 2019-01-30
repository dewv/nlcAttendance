let sport = {
  attributes: {
    name: { type: 'string', required: true, unique: true },
    season: { type: 'string', required: true, }
    
  }
};

module.exports = sport;

