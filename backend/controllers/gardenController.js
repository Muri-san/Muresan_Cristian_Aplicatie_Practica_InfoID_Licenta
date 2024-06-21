const db = require('../models/db');
const Garden = require('../models/gardenModel');
const Evolution = require('../models/evolutionModel');

const gardenController = {
    getAll: (req, res) => {
        const userId = req.session.user_id;
        Garden.getAll(userId, (err, results) => {
            if (err) {
                console.error('Error fetching garden:', err);
                res.status(500).json({ error: 'Eroare la preluarea plantelor din grădină.' });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getHistory: (req, res) => {
        const userId = req.session.user_id;
        const query = `
            SELECT g.*, p.name, p.type 
            FROM garden g
            JOIN plantoteca p ON g.plant_id = p.id
            WHERE g.user_id = ? AND g.status = 'harvested'`;
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching garden history:', err);
                return res.status(500).json({ error: 'Eroare la preluarea istoricului grădinii.' });
            }

            const plants = results;
            const plantIds = plants.map(p => p.id);
            if (plantIds.length === 0) {
                return res.status(200).json(plants);
            }

            const evolutionQuery = `
                SELECT * 
                FROM evolution 
                WHERE garden_id IN (?) 
                ORDER BY date DESC`;

            db.query(evolutionQuery, [plantIds], (err, evolutions) => {
                if (err) {
                    console.error('Error fetching evolutions:', err);
                    return res.status(500).json({ error: 'Eroare la preluarea evoluțiilor.' });
                }

                const plantsWithEvolutions = plants.map(plant => ({
                    ...plant,
                    evolutions: evolutions.filter(e => e.garden_id === plant.id)
                }));

                res.status(200).json(plantsWithEvolutions);
            });
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        const query = `
            SELECT g.*, p.name, p.type, p.category, p.plant_period, p.prune_period, p.fertilize_period, p.harvest_period 
            FROM garden g
            JOIN plantoteca p ON g.plant_id = p.id
            WHERE g.id = ?`;
        db.query(query, [id], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching garden:', err);
                return res.status(500).json({ error: 'Eroare la preluarea plantei din grădină.' });
            }
            console.log('Garden plant details:', results[0]);
            res.status(200).json(results[0]);
        });
    },

    add: (req, res) => {
        const { plantId, datePlanted } = req.body;
        const userId = req.session.user_id;
        Garden.add(userId, plantId, datePlanted, (err, result) => {
            if (err) {
                console.error('Error adding plant to garden:', err);
                res.status(500).json({ error: 'Eroare la adăugarea plantei în grădină.' });
            } else {
                res.status(201).json({ message: 'Plantă adăugată în grădină cu succes.' });
            }
        });
    },

    harvest: (req, res) => {
        const { id } = req.body;
        Garden.getById(id, (err, gardenPlant) => {
            if (err || !gardenPlant) {
                console.error('Error finding plant in garden:', err);
                return res.status(500).json({ error: 'Eroare la găsirea plantei în grădină.' });
            }
            const { user_id, plant_id, date_planted } = gardenPlant;
            const dateHarvested = new Date().toISOString().split('T')[0];

            Evolution.getByGardenId(id, (err, evolutions) => {
                if (err) {
                    console.error('Error fetching evolutions for garden:', err);
                    return res.status(500).json({ error: 'Eroare la preluarea evoluțiilor pentru plantă.' });
                }

                console.log('Evolutions to transfer:', evolutions);
                let transferErrors = false;
                let completedTransfers = 0;

                evolutions.forEach((evolution) => {
                    completedTransfers++;
                    if (completedTransfers === evolutions.length) {
                        if (transferErrors) {
                            console.log('Transfer errors occurred.');
                            return res.status(500).json({ error: 'Eroare la transferul evoluțiilor.' });
                        }
                        const query = `UPDATE garden SET status = 'harvested', date_harvest = ? WHERE id = ?`;
                        db.query(query, [dateHarvested, id], (err, result) => {
                            if (err) {
                                console.error('Error updating plant status in garden:', err);
                                return res.status(500).json({ error: 'Eroare la actualizarea statusului plantei în grădină.' });
                            }
                            console.log('Plant harvested successfully:', result);
                            res.status(200).json({ message: 'Plantă recoltată cu succes.' });
                        });
                    }
                });

                if (evolutions.length === 0) {
                    const query = `UPDATE garden SET status = 'harvested', date_harvest = ? WHERE id = ?`;
                    db.query(query, [dateHarvested, id], (err, result) => {
                        if (err) {
                            console.error('Error updating plant status in garden:', err);
                            return res.status(500).json({ error: 'Eroare la actualizarea statusului plantei în grădină.' });
                        }
                        console.log('Plant harvested successfully:', result);
                        res.status(200).json({ message: 'Plantă recoltată cu succes.' });
                    });
                }
            });
        });
    }
};

module.exports = gardenController;
