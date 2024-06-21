const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authMiddleware = require('./middleware/auth'); // Importăm middleware-ul de autentificare

const app = express();  //Initializam aplicatia Express

// Servim fișierele statice din directorul public
app.use(express.static(path.join(__dirname, 'public')));


const userRoutes = require('./routes/userRoutes');
const gardenRoutes = require('./routes/gardenRoutes');
const plantRoutes = require('./routes/plantRoutes');
const evolutionRoutes = require('./routes/evolutionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const port = 3000;

// Middleware pentru body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurarea sesiunii
app.use(session({
    secret: '123456789', // Cheie secretă pentru a semna cookie-urile de sesiune
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // True doar dacă utilizez HTTPS
}));

// Servește fișierele statice din directorul rădăcină
app.use(express.static(path.join(__dirname, '../')));

// Rutele API
app.use('/api/users', userRoutes);
app.use('/api/garden', authMiddleware, gardenRoutes); 
app.use('/api/plants', authMiddleware, plantRoutes); 
app.use('/api/evolution', authMiddleware, evolutionRoutes); 
app.use('/api', notificationRoutes);

// Ruta pentru setarea datei în sesiune
app.post('/api/setDate', (req, res) => {
    req.session.selectedDate = req.body.selectedDate;
    res.json({ message: 'Date set successfully' });
});

// Ruta pentru obținerea datei din sesiune
app.get('/api/getDate', (req, res) => {
    res.json({ selectedDate: req.session.selectedDate || new Date().toISOString().split('T')[0] });
});

// Ruta pentru pagina de pornire
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});

// Ruta pentru pagina de logare
app.get('/login.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../login.html'));
});

// Ruta pentru pagina principală (Home)
app.get('/home.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../home.html'));
});

// Pornirea serverului
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Adăugăm log pentru a verifica rutele
    console.log('Registered routes:');
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            console.log(r.route.path)
        }
    });
});
