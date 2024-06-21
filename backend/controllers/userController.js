const User = require('../models/userModel');
const { sendNotifications } = require('../controllers/notificationController'); // Importăm funcția

const userController = {
    register: (req, res) => {
        const { username, password } = req.body;
        console.log('Registering user:', username);
        User.create(username, password, (err, result) => {
            if (err) {
                console.log('Error creating user:', err);
                res.status(500).send('Eroare la crearea contului.');
            } else {
                res.status(200).send('Cont creat cu succes.');
            }
        });
    },
    login: (req, res) => {
        const { username, password } = req.body;
        console.log('Logging in user:', username);
        User.findByUsername(username, async (err, result) => {
            if (err) {
                console.log('Error logging in user:', err);
                res.status(500).send('Eroare la logare.');
            } else if (result.length === 0 || result[0].password !== password) {
                console.log('Invalid credentials');
                res.status(401).send('User sau parola incorecta.');
            } else {
                req.session.user_id = result[0].id;
                await sendNotifications(req.session.user_id, req.session.selectedDate); // Apelăm funcția de notificări
                res.status(200).json({ message: 'Logare cu succes' });
            }
        });
    }
};

module.exports = userController;
