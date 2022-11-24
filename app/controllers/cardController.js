const {Card} = require('../models');

module.exports = {
    async findAll(_, response) {
        try {
            const cards = await Card.findAll({
                include: 'labels',
                order: [
                    ['position', 'ASC'],
                ]
            });
            response.json(cards);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async findOne(request, response) {
        // on récupère l'id de la carte dans les params
        // on le transforme en number pour être sûr que le user n'a pas mis n'importe quoi
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid card id'});
        }
        try {
            const card = await Card.findByPk(id, {
                include: 'labels',
                order: [
                    ['position', 'ASC']
                ]
            });
            if (card) { // est-ce que j'ai bien récupérer des data en BDD
                response.json(card);
            } else {
                response.status(404).json({error: 'Invalid card id'});
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async addOne(request, response) {
        // on récupère les infos postées
        const infos = request.body;
        // on crée une nouvelle carde à partir de ces infos
        const newCard = new Card(infos);
        try {
            const savedCard = await newCard.save();
            response.json(savedCard);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async updateOne(request, response) {
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid card id'});
        }
        try {
            const result = await Card.update(request.body, {where: {id}});
            if (result[0] >= 1) {
                return response.json({message: `${result[0]} enregistrement(s) mis à jour`})
            }
            response.status(404).json({message: 'Aucun enregistrement mis à jour'});
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async deleteOne(request, response) {
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid card id'});
        }
        try {
            const result = await Card.destroy({where: {id}});
            if (result > 0) {
                return response.json({message: `${result} enregistrement(s) supprimé(s)`})

            }
            response.status(404).json({message: 'Aucun enregistrement supprimé'});
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }

    }

}