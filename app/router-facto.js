const express = require('express');

const router = express.Router();

const genericController = require('./controllers-facto/genericController');
const assocController = require('./controllers-facto/assocController');

/*
pour factoriser les try...catch, on définit une fonction qui va ... retourner une fonction !!
WHAAAT ? C'est possible ça ? Mais oui, c'est possible, JS c'est magique :-)

Au lieu d'appeler notre méthode de contrôleur comme ça :

router.get('/maroute', monControleur.maMethode)

on va l'appeler comme ça :

router.get('/maroute', async function(request, response, next) {
    try {
        await monControleur.maMethode(request, response, next)
    } catch(error) {
        console.error(error);
        response.status(500).json({error: error.message});
    }
});

On encapsule l'appel à la méthode du contrôleur dans une fonction qui va gérer le try ... catch
Pour éviter d'avoir à mettre le code ci-dessus (un peu verbeux) pour toutes nos routes, on crée cette fonction encapsuleuse dans une fonction qui va la retourner, 
cette fonction prend en paramètre la méthode du contrôleur à exécuter
On appelle la méthode du contrôleur dans le try...catch de la fonction encapsuleuse, toute erreur dans les méthodes de contrôleur sera capté par ce try...catch, on peut les enlever des méthodes des contrôleurs
on a factorisé la mise en place du try ... catch pour toutes les méthodes des contrôleurs :-))

*/


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