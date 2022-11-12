const { Schema, model } = require('mongoose');

const OrdersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    number: { type: Number, required: true },
    status: { type: String, required: true },
    imagesUrl: { type: Array },
    orderName: { type: String, required: true },
    index: { type: Number },
});

module.exports = model('Orders', OrdersSchema);
