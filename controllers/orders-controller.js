const ordersService = require('../service/orders-service');

class OrdersController {
    async getOrders(req, res, next) {
        try {
            const user = req.params.id;
            const ordersData = await ordersService.get(user);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrdersController();
