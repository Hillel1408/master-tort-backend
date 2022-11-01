const { Schema, model } = require('mongoose');

const RecipeGroupsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    groupName: { type: String, required: true },
    groupIcon: { type: String, required: true },
    countRecipe: { type: Number, required: true },
});

module.exports = model('Recipe-Groups', RecipeGroupsSchema);
