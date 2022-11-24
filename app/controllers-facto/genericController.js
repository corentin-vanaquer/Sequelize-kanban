const models = require('../models');

const getModelFromParam = param => {

    //params peut valoir        lists, cards ou labels
    //ce que je veux obtenir    List,   Card    Label

    //on utilise la chaine param pour obtenir, après transformation une chaine représentant le nom du modèle à utiliser
    //on passe le 1er caractère en majuscule et on lui concatène la chaine param en retirant le 1er et le dernier caractère
    const modelName = param[0].toUpperCase() + param.slice(1, -1);

    return models[modelName];
}

const getOptionsFromModel = (model, isFindAll) => {
    //dans cette méthode, on cherche à fabriquer l'object qu'on passe en paramètre de findAll
    //Selon le modèle, les paramètres seront un peu différents

    //on utilise une syntaxe include qui permet de récupérer tous les includes possibles pour un modèle
    const options = {
        include: {all: true, nested: true}
    }

    //ensuite, on adapte le contenu de l'object en fonction du modèle
    if (model.tableName === 'list') {
        //on prévoit la différence de l'order entre List.findAll et List.findOne
        //on utilise un boolean passé en paramètre lors de l'appel de la fonction
        if (isFindAll) {
            options.order = [
                ['position', 'ASC'],
                ['cards', 'position', 'ASC']
            ]
        } else {
            options.order = [
                ['cards', 'position', 'ASC']
            ]
        }
    } else if (model.tableName === 'card') {
        if (isFindAll) {
            options.order = [
                ['position', 'ASC']
            ];
        }
    }
    return options;
}

const controller = {
    findAll: async (request, response) => {
        const model = getModelFromParam(request.params.models);
        const instances = await model.findAll(getOptionsFromModel(model, true));
        response.json(instances);
    },

    findOne: async (request, response, next) => {
        const id = parseInt(request.params.id);
        const model = getModelFromParam(request.params.models);
        const instance = await model.findByPk(id, getOptionsFromModel(model, false));
    
        if (instance) {
            response.json(instance);
        } else {
            response.status(404).json({error: `Invalid ${model.tableName} id`});
        }
    },

    //pour toutes les autres méthodes, on utilise la fonction getModelFromParam pour récupérer le modèle dans une variable, on remplace les noms explicites des modèles par cette variable, le reste du code ne change pas, il est commun à tous les modèles

    addOne: async (request, response) => {
        const infos = request.body;
        const model = getModelFromParam(request.params.models);
        const newRec = new model(infos);

        const instance = await newRec.save();
        response.json(instance);
    },

    updateOne: async (request, response, next) => {
        const id = parseInt(request.params.id);
        const model = getModelFromParam(request.params.models);

        const result = await model.update(request.body, {where: {id}});
        if (result[0] >= 1) {
            return response.json({message: `${result[0]} enregistrement(s) mis à jour`})
        }
        response.status(404).json({message: 'Aucun enregistrement mis à jour'});
    },

    deleteOne: async (request, response, next) => {
        const id = parseInt(request.params.id);
        const model = getModelFromParam(request.params.models);

        const result = await model.destroy({where: {id}});
        if (result > 0) {
            return response.json({message: `${result} enregistrement(s) supprimé(s)`})
        }
        response.status(404).json({message: 'Aucun enregistrement supprimé'});
    }
};

module.exports = controller;