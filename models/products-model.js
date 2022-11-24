const { Schema, model } = require('mongoose');

const ProductsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: { type: Array },
});

module.exports = model('Products', ProductsSchema);
