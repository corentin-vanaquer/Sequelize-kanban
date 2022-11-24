const {Card, Label} = require('../models');

module.exports = {
    async findCardsByList(request, response) {
        const listId = parseInt(request.params.id);
        try {
            const cards = await Card.findAll({
                include: 'labels',
                order: [
                    ['position', 'ASC'],
                ],
                where: {list_id: listId}
            });
            response.json(cards);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async associate(request, response) {
        // extraire l'id de la carte des params
        const cardId = parseInt(request.params.id);
        // extraire l'id du label du body
        const labelId = parseInt(request.body.label_id);

        try {
            // récupérer une instance de carte
            const card = await Card.findByPk(cardId, {
                include: 'labels'
            });
            if (!card) {
                return response.status(404).json({error: `Carte d'id ${cardId} non trouvée`});
            }

            // récupérer une instance de label

            const label = await Label.findByPk(labelId);
            if (!label) {
                return response.status(404).json({error: `Label d'id ${labelId} non trouvée`});
            }

            // check si le label n'est pas déjà associé à la carte
            const existingLabel = card.labels.find(label => label.id === labelId);

            if (existingLabel) {
                return response.status(400).json({error: `Le label d'id ${labelId} est déjà associé à la carte d'id ${cardId}`});
            }

            // associer les 2
            // on utilise une méthode mixin ajoutée par Sequelize pour des modèles associés
            await card.addLabel(label);

            // pour retourner au front la version modifiée de la carte, on utilise reload
            const modifiedCard = await card.reload({
                include: 'labels'
            });
            response.json(modifiedCard);

        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async dissociate(request, response) {
        // on peut aliasser les propriétés d'un object dans la déstructuration
        // nom_original: nouveauNom
        // on récupère la valeur de la prop originale, dans notre code, on pourra y accéder avec le nouveau nom
        const {card_id: cardId, label_id: labelId} = request.params;

        try {
            // récupérer une instance de carte
            const card = await Card.findByPk(cardId, {
                include: 'labels'
            });
            if (!card) {
                return response.status(404).json({error: `Carte d'id ${cardId} non trouvée`});
            }

            // récupérer une instance de label

            const label = await Label.findByPk(labelId);
            if (!label) {
                return response.status(404).json({error: `Label d'id ${labelId} non trouvée`});
            }

            await card.removeLabel(label);

            const modifiedCard = await card.reload({
                include: 'labels'
            });
            response.json(modifiedCard);

        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }

    }
}
