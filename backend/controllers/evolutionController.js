const Evolution = require('../models/evolutionModel');
const Garden = require('../models/gardenModel'); // Asigură-te că ai importat corect modelul Garden

const evolutionController = {
    add: (req, res) => {
        const { gardenId, date, observation } = req.body;
        const userId = req.session.user_id
        // Obține plant_id din tabela garden
        Garden.getById(gardenId, (err, gardenPlant) => {
            if (err || !gardenPlant) {
                console.error('Error finding plant in garden:', err);
                res.status(500).json({ error: 'Eroare la găsirea plantei în grădină.' });
                return;
            }
            const plantId = gardenPlant.plant_id;
            Evolution.add(gardenId, plantId, userId, date, observation, (err, result) => {
                if (err) {
                    console.error('Error adding evolution:', err);
                    res.status(500).json({ error: 'Eroare la adăugarea evoluției.' });
                } else {
                    res.status(201).json({ message: 'Evoluție adăugată cu succes.' });
                }
            });
        });
    },
    getByGardenId: (req, res) => {
        const gardenId = req.params.gardenId;
        Evolution.getByGardenId(gardenId, (err, results) => {
            if (err) {
                console.error('Error fetching evolution:', err);
                res.status(500).json({ error: 'Eroare la preluarea evoluției.' });
            } else {
                res.status(200).json(results);
            }
        });
    }
};

module.exports = evolutionController;
