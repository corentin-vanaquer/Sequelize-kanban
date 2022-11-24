const {Label} = require('../models');

module.exports = {
    async findAll(_, response) {
        try {
            const labels = await Label.findAll();
            response.json(labels);
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
            return response.status(404).json({error: 'Invalid label id'});
        }
        try {
            const label = await Label.findByPk(id);
            if (label) { // est-ce que j'ai bien récupérer des data en BDD
                response.json(label);
            } else {
                response.status(404).json({error: 'Invalid label id'});
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async addOne(request, response) {
        // on récupère les infos postées
        const infos = request.body;
        // on crée un nouveau label à partir de ces infos
        const newLabel = new Label(infos);
        try {
            const savedLabel = await newLabel.save();
            response.json(savedLabel);
        } catch (error) {
            console.error(error);
            response.status(500).json({error: error.message});
        }
    },

    async updateOne(request, response) {
        const id = parseInt(request.params.id);
        if (isNaN(id)) {
            return response.status(404).json({error: 'Invalid label id'});
        }
        try {
            const result = await Label.update(request.body, {where: {id}});
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
            return response.status(404).json({error: 'Invalid label id'});
        }
        try {
            const result = await Label.destroy({where: {id}});
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