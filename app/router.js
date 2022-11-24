const {Router} = require('express');

// TODO : require les contrôleurs
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const labelController = require('./controllers/labelController');
const assocController = require('./controllers/assocController');

const {validateCard} = require('./middlewares/validator');

const router = Router();

// TODO : ajouter des routes

// récupérer toutes les listes
router.get('/lists', listController.findAll);

// récupérer une liste
router.get('/lists/:id', listController.findOne);

// créer une nouvelle liste
router.post('/lists', listController.addOne);

// mettre à jour une liste
router.patch('/lists/:id', listController.updateOne);

// supprimer une liste
router.delete('/lists/:id', listController.deleteOne);

// récupérer toutes les cartes
router.get('/cards', cardController.findAll);

// récupérer toutes les cartes d'une liste
router.get('/lists/:id/cards', assocController.findCardsByList);

// récupérer une carte
router.get('/cards/:id', cardController.findOne);

// ajouter une carte
router.post('/cards', validateCard, cardController.addOne);

// modifier une carte
router.patch('/cards/:id', cardController.updateOne);

// supprimer une carte
router.delete('/cards/:id', cardController.deleteOne);

// récupérer tous les labels
router.get('/labels', labelController.findAll);

// récupérer un label
router.get('/labels/:id', labelController.findOne);

// ajouter un label
router.post('/labels', labelController.addOne);

// modifier un label
router.patch('/labels/:id', labelController.updateOne);

// supprimer un label
router.delete('/labels/:id', labelController.deleteOne);

// associer un label à une carte
router.post('/cards/:id/label', assocController.associate);

// dissocier un label d'une carte
router.delete('/cards/:card_id/label/:label_id', assocController.dissociate);

module.exports = router;