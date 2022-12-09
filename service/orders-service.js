const kanbanModel = require('../models/kanban-model');
const ordersModel = require('../models/orders-model');

var ObjectId = require('mongodb').ObjectID;

class OrdersService {
    async get(user) {
        const ordersData = await ordersModel.find({ user });
        return ordersData;
    }

    async getOrder(id) {
        const orderData = await ordersModel.findOne({ _id: id });
        return orderData;
    }

    async getKanban(user) {
        const ordersData = await kanbanModel.findOne({ user });
        return ordersData;
    }

    async createKanban(data) {
        const ordersData = await kanbanModel.findOne({
            user: ObjectId(data.userId),
        });
        if (ordersData) {
            ordersData[data.currentBoard.type] = data.currentBoard.items;
            ordersData[data.board.type] = data.board.items;
            return ordersData.save();
        }
    }

    async update(user, data) {
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
        const ordersData = await kanbanModel.findOne({
            user: ObjectId(user),
        });
        ordersData.ready = [];
        await ordersData.save();
        return {
            success: true,
        };
    }

    async create(userId, data) {
        if (data._id) {
            const orderData = await ordersModel.findOne({ _id: data._id });
            if (orderData) {
                Object.keys(data).map((key) => {
                    if (key !== '_id' && key !== 'user')
                        orderData[key] = data[key];
                });
                const kanbanData = await kanbanModel.findOne({
                    user: ObjectId(userId),
                });
                Object.keys(kanbanData._doc).map((key) => {
                    if (Array.isArray(kanbanData[key])) {
                        kanbanData[key].map((item, index) => {
                            if (item._id === data._id) {
                                const nweValue = [...kanbanData[key]];
                                nweValue[index] = data;
                                kanbanData[key] = nweValue;
                            }
                        });
                    }
                });
                await kanbanData.save();
                return orderData.save();
            }
        } else {
            const count = await ordersModel.find({ user: ObjectId(userId) });
            const ordersData = await ordersModel.create({
                user: userId,
                status: 'kanban',
                number: count.length + 1,
                ...data,
            });
            const kanbanData = await kanbanModel.findOne({
                user: ObjectId(userId),
            });
            if (kanbanData) {
                kanbanData.upcoming = [...kanbanData.upcoming, ordersData];
                await kanbanData.save();
            } else {
                const kanbanData = await kanbanModel.create({
                    user: userId,
                    inWork: [],
                    purchase: [],
                    ready: [],
                    upcoming: [ordersData],
                });
            }
            return ordersData;
        }
    }
}

module.exports = new OrdersService();
