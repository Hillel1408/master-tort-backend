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

    async getOrdersKanban(req, res, next) {
        try {
            const user = req.params.id;
            const ordersData = await ordersService.getKanban(user);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }

    async createOrdersKanban(req, res, next) {
        try {
            const ordersData = await ordersService.createKanban(req.body);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }

    async createOrder(req, res, next) {
        try {
            const ordersData = await ordersService.create(req.body);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }

    async updateOrders(req, res, next) {
        const userId = req.params.id;
        try {
            const ordersData = await ordersService.update(userId, req.body);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrdersController();
