const kanbanModel = require('../models/kanban-model');
const ordersModel = require('../models/orders-model');

var ObjectId = require('mongodb').ObjectID;

class OrdersService {
    async get(user) {
        const ordersData = await ordersModel.find({ user });
        return ordersData;
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
        console.log(user);
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
}

module.exports = new OrdersService();
