const { Schema, model } = require('mongoose');

const RecipeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Recipe-Groups' },
    recipeName: { type: String, required: true },
    recipeUrl: { type: String },
    products: { type: Array },
});

module.exports = model('Recipe', RecipeSchema);
