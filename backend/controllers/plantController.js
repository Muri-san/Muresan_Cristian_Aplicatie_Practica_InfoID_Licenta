const db = require('../models/db');
const Plant = require('../models/plantModel');

const plantController = {
    getAll: (req, res) => {
        Plant.getAll((err, results) => {
            if (err) {
                res.status(500).json({ error: 'Eroare la preluarea plantelor.' });
            } else {
                res.status(200).json(results);
            }
        });
    },
    add: (req, res) => {
        const { name, type, category, plant_period, prune_period, fertilize_period, harvest_period } = req.body;

        // Dacă perioadele sunt șiruri de caractere, le transformăm în array și le verificăm
        const plantPeriod = plant_period ? plant_period.split(',') : [];
        const prunePeriod = prune_period ? prune_period.split(',') : [];
        const fertilizePeriod = fertilize_period ? fertilize_period.split(',') : [];
        const harvestPeriod = harvest_period ? harvest_period.split(',') : [];

        // Transformăm array-urile în șiruri de caractere separate prin virgulă
        const plantPeriodStr = plantPeriod.length ? plantPeriod.join(',') : null;
        const prunePeriodStr = prunePeriod.length ? prunePeriod.join(',') : null;
        const fertilizePeriodStr = fertilizePeriod.length ? fertilizePeriod.join(',') : null;
        const harvestPeriodStr = harvestPeriod.length ? harvestPeriod.join(',') : null;

        Plant.add(name, type, category, plantPeriodStr, prunePeriodStr, fertilizePeriodStr, harvestPeriodStr, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Eroare la adăugarea plantei.' });
            } else {
                res.status(201).json({ message: 'Plantă adăugată cu succes.' });
            }
        });
    },   
    getById: (req, res) => {
        const id = req.params.id;
        Plant.getById(id, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Eroare la preluarea plantei.' });
            } else {
                res.status(200).json(result);
            }
        });
    },
    deleteMultiple: (req, res) => {
        const { ids } = req.body;
        console.log('IDs to delete:', ids); // Log pentru a verifica ce IDs sunt trimise

        Plant.deleteMultiple(ids, (err, result) => {
            if (err) {
                console.error('Error deleting plants:', err); // Adaugă un log pentru a verifica eroarea
                res.status(500).json({ error: 'Eroare la ștergerea plantelor.' });
            } else {
                res.status(200).json({ message: 'Plante șterse cu succes.' });
            }
        });
    }

};

module.exports = plantController;
