const db = require('./db');

const Evolution = {
    add: (gardenId, plantId, userId, date, observation, callback) => {
        const query = 'INSERT INTO evolution (garden_id, plant_id, user_id, date, observation) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [gardenId, plantId, userId, date, observation], callback);
    },
    getByGardenId: (gardenId, callback) => {
        const query = 'SELECT * FROM evolution WHERE garden_id = ?';
        db.query(query, [gardenId], callback);
    },
    deleteByGardenId: (gardenId, callback) => {
        const query = 'DELETE FROM evolution WHERE garden_id = ?';
        db.query(query, [gardenId], callback);
    }
};

module.exports = Evolution;
