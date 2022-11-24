const express = require('express');

const router = express.Router();

const genericController = require('./controllers-facto/genericController');
const assocController = require('./controllers-facto/assocController');


const genericTryCatch = controllerMethod => {
    return async (request, response, next) => {
        try {
            await controllerMethod(request, response, next);
        } catch(error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    }
}

// récupérer toutes les enregistrements
router.get('/:models', genericTryCatch(genericController.findAll));

// récupérer un enregistrement
router.get('/:models/:id', genericTryCatch(genericController.findOne));

// ajouter un enregistrement
router.post('/:models', genericTryCatch(genericController.addOne));

// modifier un enregistrement
router.patch('/:models/:id', genericTryCatch(genericController.updateOne));

// supprimer un enregistrement
router.delete('/:models/:id', genericTryCatch(genericController.deleteOne));




// récupérer toutes les cartes d'une liste
router.get('/lists/:id/cards', genericTryCatch(assocController.findCardsByList));

// associer un label à une carte
router.post('/cards/:id/label', genericTryCatch(assocController.associate));

// dissocier un label d'une carte
router.delete('/cards/:card_id/label/:label_id', genericTryCatch(assocController.dissociate));

module.exports = router;