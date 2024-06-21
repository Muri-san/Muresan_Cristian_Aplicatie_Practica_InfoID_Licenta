const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.get('/', plantController.getAll);
router.post('/add', plantController.add);
router.delete('/delete', plantController.deleteMultiple);
router.get('/:id', plantController.getById);


module.exports = router;
