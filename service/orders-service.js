const ordersModel = require('../models/orders-model');

class OrdersService {
    async get(user) {
        const ordersData = await ordersModel.find({ user });
        return ordersData;
    }
}

module.exports = new OrdersService();
