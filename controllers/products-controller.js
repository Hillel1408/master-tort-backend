const productsService = require('../service/products-service');

class ProductsController {
    async createProducts(req, res, next) {
        //создаем продукты пользователя
        try {
            const response = await productsService.create(req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getProducts(req, res, next) {
        //получаем продукты пользователя
        try {
            const productsData = await productsService.get(req.params.id);
            return res.json(productsData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProductsController();
