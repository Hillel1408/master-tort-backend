const { Schema, model } = require('mongoose');

const OrdersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    number: { type: Number, required: true },
    type: { type: String, required: true },
    imagesUrl: { type: Array },
    orderName: { type: String, required: true },
});

module.exports = model('Orders', OrdersSchema);
