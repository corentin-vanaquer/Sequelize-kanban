const {List} = require('../models');

module.exports = {
    async findAll(_, response) {
        try {
            const lists = await List.findAll({
                include: {
                    association: 'cards',
                    include: 'labels'
                },
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ]
            });
            response.json(lists);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async findOne(request, response) {
        // on récupère l'id de la liste dans les params
        // on le transforme en number pour être sûr que le user n'a pas mis n'importe quoi
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid list id'});
        }
        try {
            const list = await List.findByPk(id, {
                include: {
                    association: 'cards',
                    include: 'labels'
                },
                order: [
                    ['cards', 'position', 'ASC']
                ]
            });
            if (list) { // est-ce que j'ai bien récupérer des data en BDD
                response.json(list);
            } else {
                response.status(404).json({error: 'Invalid list id'});
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async addOne(request, response) {
        // on récupère les infos postées
        const infos = request.body;
        // on crée une nouvelle liste à partir de ces infos
        const newList = new List(infos);
        try {
            const savedList = await newList.save();
            response.json(savedList);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async updateOne(request, response) {
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid list id'});
        }
        try {
            const result = await List.update(request.body, {where: {id}});
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
            return response.status(404).json({error: 'Invalid list id'});
        }
        try {
            const result = await List.destroy({where: {id}});
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