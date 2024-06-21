const express = require('express');
const router = express.Router();
const { getNotifications, sendNotifications } = require('../controllers/notificationController');
const  ensureAuthenticated  = require('../middleware/auth');

router.get('/notifications', ensureAuthenticated, getNotifications);

// Rută nouă pentru a crea notificări
router.get('/createNotifications', ensureAuthenticated, async (req, res) => {
    const user_id = req.session.user_id;
    const selectedDate = req.session.selectedDate || new Date().toISOString().split('T')[0]; // Obținem data selectată sau data curentă
    try {
        await sendNotifications(user_id, selectedDate);
        res.status(200).send({ message: 'Notifications created' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating notifications', error });
    }
});


module.exports = router;
