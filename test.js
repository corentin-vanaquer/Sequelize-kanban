require('dotenv').config();

const {List} = require('./app/models');

// IIFE : Immediately Invoked Function Expression
// on déclare une fonction anonyme qu'on appelle directement après la déclaration
(async () => {
    try {
        const lists = await List.findAll({
            include: {
                association: 'cards',
                include: 'labels'
            },
            order: [
                ['cards', 'position', 'ASC']
            ]
        });
        lists.forEach(list => {
            console.log(`La liste ${list.name} contient les cartes suivantes :`);
            list.cards.forEach(card => {
                console.log(`\t- ${card.title} avec les labels ${card.labels.map(label => label.name).join(',')}`);
            })
        });
    } catch (error) {
        console.log(error);
    }

})();

