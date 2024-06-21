const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');
const auth = require('../middleware/auth'); // Importăm middleware-ul de autentificare

router.use(auth); // Aplicația middleware-ului de autentificare la toate rutele din gardenRoutes

router.get('/', gardenController.getAll);
router.post('/add', gardenController.add);
router.post('/harvest', gardenController.harvest);
router.get('/history', gardenController.getHistory);
router.get('/:id', gardenController.getById);


module.exports = router;
