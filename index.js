require('dotenv').config();
const multer = require('multer');
const bodyParser = multer();
const express = require('express');
const router = require('./app/router-facto');
const cors = require('cors');
const sanitize = require('./app/middlewares/request-sanitizer');


const app = express();

const port = process.env.PORT || 5000;

// on dit au vigile de laisser rentrer tout le monde
// quelque soit le nom de domaine et le port à l'origine de la requête HTTP, on autorise l'accès
app.use(cors({
    origin: ['http://localhost:3500', 'null']
}));

app.use( bodyParser.none() );

// on doit indiquer à express comment il va pouvoir interpréter le body de la requête
// on lui ajoute le middleware qui va bien
app.use(express.urlencoded({extended: true}));

app.use(sanitize, router);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});