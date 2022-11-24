const productsModel = require('../models/products-model');
var ObjectId = require('mongodb').ObjectID;

class ProductsService {
    async create(data) {
        const productsData = await productsModel.findOne({
            user: ObjectId(data.userId),
        });
        if (productsData) {
            productsData.products = data.tr;
            return productsData.save();
        }
        const products = await productsModel.create({
            user: data.userId,
            products: data.tr,
        });
        return products;
    }

    async get(user) {
        const productsData = await productsModel.findOne({ user });
        return productsData;
    }
}

module.exports = new ProductsService();
