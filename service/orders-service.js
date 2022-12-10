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
                    if (key !== '_id' && key !== 'user')
                        orderData[key] = data[key];
                });
                //получаем канбан доску пользователя
                const kanbanData = await kanbanModel.findOne({
                    user: ObjectId(userId),
                });
                //перебираем заказы на канбан доске, ищем изменяемый заказ
                Object.keys(kanbanData._doc).map((key) => {
                    if (Array.isArray(kanbanData[key])) {
                        kanbanData[key].map((item, index) => {
                            if (item._id === data._id) {
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

    async calculation(data) {
        //получаем рецепт
        const recipeData = await recipeModel.findOne({
            _id: data.table[0].recipe.value,
        });
        //получаем настройки пользователя
        const settingsData = await settingsModel.findOne({
            user: ObjectId(data.user),
        });
        if (data.cakeShape === 'circle') {
            //объем 1 п. голый
            let value = null;
            switch (data.kindCake) {
                case 'open-cake':
                    value =
                        recipeData.totalVolume / (recipeData.exit / data.range);
            }
            //порций в ярусе
            const portion =
                calculationService.size(
                    data.table[0].diameter,
                    data.table[0].height
                ) / value;
            //вес яруса в кг.
            const weight = (portion * data.range) / 1000;
            //площадь поверхности
            const square = calculationService.square(
                data.table[0].diameter,
                data.table[0].height
            );
            //крем
            const cream =
                (square * settingsData.amountCream[0]) / settingsData.square[0];
            //мастика
            const mastic =
                (square * settingsData.amountMastic[0]) /
                settingsData.square[0];
            //общий вес яруса в кг.
            const totalWeight = (mastic + cream) / 1000 + weight;
        }
    }
}

module.exports = new OrdersService();
