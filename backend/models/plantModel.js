const db = require('./db');

const Plant = {
    getAll: (callback) => {
        const query = 'SELECT * FROM plantoteca';
        db.query(query, callback);
    },
    add: (name, type, category, plantPeriod, prunePeriod, fertilizePeriod, harvestPeriod, callback) => {
        const query = 'INSERT INTO plantoteca (name, type, category, plant_period, prune_period, fertilize_period, harvest_period) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [name, type, category, plantPeriod, prunePeriod, fertilizePeriod, harvestPeriod], callback);
    },   
   deleteMultiple: (ids, callback) => {
    console.log('Query for deleteMultiple:', `DELETE FROM plantoteca WHERE id IN (${ids.join(',')})`); // Log pentru query
    const query = `DELETE FROM plantoteca WHERE id IN (?)`;
    db.query(query, [ids], (err, result) => {
        if (err) {
            console.error('Error executing delete query:', err); // Log pentru eroare
        }
        callback(err, result);
    });
},
    getById: (id, callback) => {
        const query = 'SELECT * FROM plantoteca WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    findAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM plantoteca';
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

};

module.exports = Plant;
