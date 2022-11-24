const List = require('./list');
const Card = require('./card');
const Label = require('./label');

// association List et Card

List.hasMany(Card, {
    as: 'cards',
    foreignKey: 'list_id'
});

Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id'
});


// association many to many entre Card et Label

Card.belongsToMany(Label, {
    as: 'labels',
    foreignKey: 'card_id',
    otherKey: 'label_id',
    through: 'card_has_label',
    timestamps: false
});

Label.belongsToMany(Card, {
    as: 'cards',
    foreignKey: 'label_id',
    otherKey: 'card_id',
    through: 'card_has_label',
    timestamps: false
});


module.exports = {
    List,
    Card,
    Label
};
