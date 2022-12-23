const ordersService = require('../service/orders-service');

class OrdersController {
    async getOrders(req, res, next) {
        //получаем заказы пользователя
        try {
            const user = req.params.id;
            const ordersData = await ordersService.get(user);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }

    async getOrder(req, res, next) {
        //получаем заказ пользователя
        try {
            const id = req.params.id;
            const orderData = await ordersService.getOrder(id);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async getOrdersKanban(req, res, next) {
        //получаем канбан доску пользователя
        try {
            const user = req.params.id;
            const kanbanData = await ordersService.getKanban(user);
            return res.json(kanbanData);
        } catch (e) {
            next(e);
        }
    }

    async createOrdersKanban(req, res, next) {
        //создаем канбан доску пользователя
        try {
            const response = await ordersService.createKanban(req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async createOrder(req, res, next) {
        //создаем заказ
        const userId = req.params.id;
        try {
            const response = await ordersService.create(userId, req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async updateOrder(req, res, next) {
        //обновляем заказ
        const userId = req.params.id;
        try {
            const response = await ordersService.update(userId, req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async calculationOrder(req, res, next) {
        //расчитываем заказ
        try {
            const orderData = await ordersService.calculation(req.body);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async updateTotal(req, res, next) {
        try {
            //обновляем закупку
            const userId = req.params.id;
            const response = await ordersService.updateTotal(userId, req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async deleteOrder(req, res, next) {
        try {
            //удаляем заказ
            const orderId = req.params.id;
            const response = await ordersService.deleteOrder(orderId, req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrdersController();
