const { Schema, model } = require('mongoose');

const RecipeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Recipe-Groups' },
    recipeName: { type: String, required: true },
    recipeUrl: { type: String },
    products: { type: Array },
    checkbox: { type: Boolean },
    exit: { type: Number },
    height: { type: Number },
    diameter: { type: Number },
    totalVolume: { type: Number },
    square: { type: Number },
});

module.exports = model('Recipe', RecipeSchema);
