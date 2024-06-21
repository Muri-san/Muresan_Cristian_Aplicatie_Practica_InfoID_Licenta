const express = require('express');
const router = express.Router();
const evolutionController = require('../controllers/evolutionController');

router.post('/add', evolutionController.add);
router.get('/:gardenId', evolutionController.getByGardenId);

module.exports = router;
