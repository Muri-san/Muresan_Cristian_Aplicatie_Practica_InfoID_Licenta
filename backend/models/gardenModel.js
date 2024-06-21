const db = require('./db');

const Garden = {
    getAll: (userId, callback) => {
        const query = `SELECT g.*, p.name, p.type 
                       FROM garden g
                       JOIN plantoteca p ON g.plant_id = p.id
                       WHERE g.user_id = ? AND g.status = 'active'`;
        db.query(query, [userId], callback);
    },

    getHistory: (userId, callback) => {
        const query = `SELECT g.*, p.name, p.type 
                       FROM garden g
                       JOIN plantoteca p ON g.plant_id = p.id
                       WHERE g.user_id = ? AND g.status = 'harvested'`;
        db.query(query, [userId], callback);
    },

    add: (userId, plantId, datePlanted, callback) => {
        const query = `INSERT INTO garden (user_id, plant_id, date_planted, status) VALUES (?, ?, ?, 'active')`;
        db.query(query, [userId, plantId, datePlanted], callback);
    },

    delete: (id, dateHarvested, callback) => {
        const query = `UPDATE garden SET status = 'harvested', date_harvest = ? WHERE id = ?`;
        db.query(query, [dateHarvested, id], callback);
    },

    getById: (id, callback) => {
        const query = `SELECT g.*, p.name, p.type 
                       FROM garden g
                       JOIN plantoteca p ON g.plant_id = p.id
                       WHERE g.id = ?`;
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    },
    findByUserId: (user_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT g.*, p.name, p.type, p.prune_period, p.fertilize_period, p.harvest_period
                           FROM garden g
                           JOIN plantoteca p ON g.plant_id = p.id
                           WHERE g.user_id = ?`;
            db.query(query, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = Garden;
