let sport = {
  attributes: {
    name: { type: 'string', required: true, unique: true },
    season: { type: 'string', required: true, isIn: ['Fall','Spring'] }
    
  }
};

module.exports = sport;

