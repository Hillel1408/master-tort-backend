const { Schema, model } = require('mongoose');

const OrdersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    number: { type: Number },
    status: { type: String, required: true },
    imagesUrl: { type: Array },
    orderName: { type: String, required: true },
    info: { type: String },
    range: { type: Number },
    standWidth: { type: Number },
    standLength: { type: Number },
    price: { type: Number },
    cakeShape: { type: String },
    kindCake: { type: String },
    table: { type: Array },
    calculation: { type: Array },
    total: { type: Array },
    cream: { type: Object },
    recipeCream: { type: Array },
});

module.exports = model('Orders', OrdersSchema);
