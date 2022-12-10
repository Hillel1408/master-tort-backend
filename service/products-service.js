const productsModel = require('../models/products-model');
var ObjectId = require('mongodb').ObjectID;

class ProductsService {
    async create(data) {
        const productsData = await productsModel.findOne({
            user: ObjectId(data.userId),
        });
        //если продукты уже существуют, то перезаписываем их
        if (productsData) {
            productsData.products = data.tr;
            await productsData.save();
            return {
                success: true,
            };
        }
        //либо создаем их
        const products = await productsModel.create({
            user: data.userId,
            products: data.tr,
        });
        return {
            success: true,
        };
    }

    //получаем продукты пользователя
    async get(user) {
        const productsData = await productsModel.findOne({ user });
        return productsData;
    }
}

module.exports = new ProductsService();
