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
                                console.log(typeof item._id, typeof data._id);
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
            //если форма торта - круг
            if (data.cakeShape === 'circle') {
                let value = null;
                switch (data.kindCake) {
                    //объем 1 п. голый
                    case 'open-cake':
                        value =
                            recipeData.totalVolume /
                            (recipeData.exit / data.range);
                        break;
                    //объем 1 п. мастичный
                    case 'buttercream-cake':
                        value =
                            recipeData.totalVolume /
                            ((recipeData.exit +
                                (recipeData.square *
                                    settingsData.amountMastic[0]) /
                                    settingsData.square[0] +
                                (recipeData.square *
                                    settingsData.amountCream[0]) /
                                    settingsData.square[0]) /
                                data.range);
                        break;
                    //объем 1 п. кремовый
                }
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
                const cream =
                    (square * settingsData.amountCream[0]) /
                    settingsData.square[0];
                //мастика
                const mastic =
                    (square * settingsData.amountMastic[0]) /
                    settingsData.square[0];
                //общий вес яруса в кг.
                const totalWeight = (mastic + cream) / 1000 + weight;
                //записываем ответ
                arr.push({
                    portion: portion,
                    weight: weight,
                    cream: cream,
                    mastic: mastic,
                    totalWeight: totalWeight,
                });
                //расчитываем итог
                total.portion = total.portion + portion;
                total.cream = total.cream + cream;
                total.mastic = total.mastic + mastic;
                total.totalWeight = total.totalWeight + totalWeight;
                //считаем объем яруса
                const size = calculationService.size(
                    data.table[i].diameter,
                    data.table[i].height
                );
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
        return calculation;
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
}

module.exports = new OrdersService();
