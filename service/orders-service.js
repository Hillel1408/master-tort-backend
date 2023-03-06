const calculationService = require('./calculation-service');
const kanbanModel = require('../models/kanban-model');
const ordersModel = require('../models/orders-model');
const recipeModel = require('../models/recipe-model');
const settingsModel = require('../models/settings-model');

var ObjectId = require('mongodb').ObjectID;

class OrdersService {
    async get(user) {
        //получаем заказы пользователя
        const ordersData = await ordersModel.find({ user });
        return ordersData;
    }

    async getOrder(id) {
        //получаем заказ пользователя
        const orderData = await ordersModel.findOne({ _id: id });
        return orderData;
    }

    async getKanban(user) {
        //получаем канбан доску пользователя
        const kanbanData = await kanbanModel.findOne({ user });
        return kanbanData;
    }

    async createKanban(data) {
        //перезаписывает значения канбан досок
        const kanbanData = await kanbanModel.findOne({
            user: ObjectId(data.userId),
        });
        if (kanbanData) {
            kanbanData[data.currentBoard.type] = data.currentBoard.items;
            kanbanData[data.board.type] = data.board.items;
            await kanbanData.save();
            return {
                success: true,
            };
        }
    }

    async update(user, data) {
        //меняем статус заказов на архивный
        data.items.forEach(async (item) => {
            await ordersModel.updateOne(
                {
                    _id: item._id,
                },
                {
                    status: 'archive',
                }
            );
        });
        const kanbanData = await kanbanModel.findOne({
            user: ObjectId(user),
        });
        //обновляем канбан доску
        kanbanData.ready = [];
        await kanbanData.save();
        return {
            success: true,
        };
    }

    async create(userId, data) {
        //если есть _id заказа, значит он уже создан и мы его обновляем
        if (data._id) {
            const orderData = await ordersModel.findOne({ _id: data._id });
            if (orderData) {
                //записываем новые значения полей заказа
                Object.keys(data).map((key) => {
                    if (key !== '_id' && key !== 'user' && key !== '__v') {
                        orderData[key] = data[key];
                    }
                });
                //получаем канбан доску пользователя
                const kanbanData = await kanbanModel.findOne({
                    user: ObjectId(userId),
                });
                //перебираем заказы на канбан доске, ищем изменяемый заказ
                Object.keys(kanbanData._doc).map((key) => {
                    if (Array.isArray(kanbanData[key])) {
                        kanbanData[key].map((item, index) => {
                            if (item._id == data._id) {
                                //перезаписываем новое значения канбан доски, с измененным заказом
                                const newValue = [...kanbanData[key]];
                                newValue[index] = data;
                                kanbanData[key] = newValue;
                            }
                        });
                    }
                });
                await kanbanData.save();
                await orderData.save();
                return {
                    success: true,
                };
            }
        } else {
            //иначе заказ не существует и мы его создаем
            const count = await ordersModel.find({ user: ObjectId(userId) });
            const orderData = await ordersModel.create({
                user: userId,
                status: 'kanban',
                number: count.length + 1,
                ...data,
            });
            const kanbanData = await kanbanModel.findOne({
                user: ObjectId(userId),
            });
            //если доска заказов уже существует то добавляем на нее созданный заказ
            if (kanbanData) {
                kanbanData.upcoming = [...kanbanData.upcoming, orderData];
                await kanbanData.save();
            } else {
                //если не существует то создаем
                const kanbanData = await kanbanModel.create({
                    user: userId,
                    inWork: [],
                    purchase: [],
                    ready: [],
                    upcoming: [orderData],
                });
            }
            return {
                success: true,
            };
        }
    }

    async deleteOrder(orderId, data) {
        //удаляем заказ пользователя
        await ordersModel.updateOne(
            {
                _id: ObjectId(orderId),
            },
            {
                status: 'delete',
            }
        );
        const kanbanData = await kanbanModel.findOne({
            user: ObjectId(data.userId),
        });
        Object.keys(kanbanData._doc).map((key) => {
            if (Array.isArray(kanbanData[key])) {
                kanbanData[key].map((item, index) => {
                    if (item._id === orderId) {
                        const newValue = [...kanbanData[key]];
                        newValue.splice(index, 1);
                        kanbanData[key] = newValue;
                    }
                });
            }
        });
        await kanbanData.save();
        return {
            success: true,
        };
    }

    async updateTotal(userId, data) {
        data.forEach(async (item) => {
            const orderData = await ordersModel.findOne({ _id: item._id });
            if (orderData) {
                orderData.total = item.total;
                await orderData.save();
            }
        });
        //получаем канбан доску пользователя
        const kanbanData = await kanbanModel.findOne({
            user: ObjectId(userId),
        });
        //обновляем закупку
        kanbanData.purchase = data;
        await kanbanData.save();
        return {
            success: true,
        };
    }

    async updateTable(userId, data) {
        data.forEach(async (item) => {
            const orderData = await ordersModel.findOne({ _id: item._id });
            if (orderData) {
                orderData.table = item.table;
                await orderData.save();
            }
        });
        //получаем канбан доску пользователя
        const kanbanData = await kanbanModel.findOne({
            user: ObjectId(userId),
        });
        //обновляем закупку
        kanbanData.inWork = data;
        await kanbanData.save();
        return {
            success: true,
        };
    }

    async calculation(data) {
        //получаем настройки пользователя
        const settingsData = await settingsModel.findOne({
            user: ObjectId(data.user),
        });
        const arr = [];
        const calculation = [];
        const total = { portion: 0, cream: 0, mastic: 0, totalWeight: 0 };
        //получаем рецепт
        for (let i = 0; i < data.table.length; i++) {
            const recipeData = await recipeModel.findOne({
                _id: data.table[i].recipe.value,
            });
            const b = settingsData.square[0];
            const c = settingsData.amountMastic[0];
            const d = settingsData.amountCream[0];
            //если форма торта - круг
            if (data.cakeShape === 'circle') {
                let value =
                    recipeData.totalVolume / (recipeData.exit / data.range);
                //порций в ярусе
                const portion =
                    calculationService.size(
                        data.table[i].diameter,
                        data.table[i].height
                    ) / value;
                //вес яруса в кг.
                const weight = (portion * data.range) / 1000;
                //площадь поверхности
                const square = calculationService.square(
                    data.table[i].diameter,
                    data.table[i].height
                );
                //крем
                const cream = (square * d) / b;
                //мастика
                const mastic = (square * c) / b;
                //общий вес яруса в кг.
                let totalWeight;
                //считаем объем яруса
                const size = calculationService.size(
                    data.table[i].diameter,
                    data.table[i].height
                );
                //записываем ответ
                const obj = {
                    portion: portion,
                    weight: weight,
                    size: size,
                };
                switch (data.kindCake) {
                    case 'open-cake':
                        totalWeight = weight;
                        arr.push({
                            ...obj,
                            totalWeight: totalWeight,
                        });
                        break;
                    case 'buttercream-cake':
                        totalWeight = (mastic + cream) / 1000 + weight;
                        arr.push({
                            ...obj,
                            totalWeight: totalWeight,
                            cream: cream,
                            mastic: mastic,
                        });
                        total.mastic = total.mastic + mastic;
                        total.cream = total.cream + cream;
                        break;
                    case 'cream-cake':
                        totalWeight = cream / 1000 + weight;
                        arr.push({
                            ...obj,
                            totalWeight: totalWeight,
                            cream: cream,
                        });
                        total.cream = total.cream + cream;
                        break;
                }
                //расчитываем итог
                total.portion = total.portion + portion;
                total.totalWeight = total.totalWeight + totalWeight;
                //считаем продукты на ярус
                const newItems = [];
                recipeData.products.map((item) => {
                    const newProducts = [];
                    item.products.map((product) => {
                        newProducts.push({
                            ...product,
                            net: (product.net * size) / recipeData.totalVolume,
                        });
                    });
                    newItems.push({ ...item, products: newProducts });
                });
                calculation.push({
                    products: newItems,
                    calculat: arr[i],
                });
            }
        }
        calculation.push(total);
        //cчитаем продукты на крем
        const recipeCream = [];
        if (
            data.kindCake === 'buttercream-cake' ||
            data.kindCake === 'cream-cake'
        ) {
            const recipeData = await recipeModel.findOne({
                _id: data.cream.value,
            });
            recipeData.products.map((item) => {
                const newProducts = [];
                item.products.map((product) => {
                    newProducts.push({
                        ...product,
                        net:
                            (calculation[calculation.length - 1].cream /
                                recipeData.exit) *
                            product.net,
                    });
                });
                recipeCream.push({ ...item, products: newProducts });
            });
        }
        return { calculation: calculation, recipeCream: recipeCream };
    }
}

module.exports = new OrdersService();
