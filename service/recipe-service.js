const groupModel = require('../models/recipe-groups-model');

class RecipeService {
    async createGroup(data) {
        const groupData = await groupModel.findOne({ user: data.userId });
        if (groupData) {
            const groupData = await groupModel.create({
                user: data.userId,
                ...data,
            });
            return groupData;
        }
        const group = await groupModel.create({
            user: data.userId,
            ...data,
        });
        return group;
    }
    async getGroups(userId) {
        const groupData = await groupModel.find({ user: userId });
        return groupData;
    }
}

module.exports = new RecipeService();
