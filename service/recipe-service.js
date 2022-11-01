const groupModel = require('../models/recipe-groups-model');

class RecipeService {
    async createGroup(data) {
        const groupData = await groupModel.findOne({ user: data.userId });
        if (groupData) {
            const groupData = await groupModel.create({
                user: data.userId,
                groupName: data.groupName,
                groupIcon: data.groupIcon,
                countRecipe: data.countRecipe,
            });
            return groupData;
        }
        const group = await groupModel.create({
            user: data.userId,
            groupName: data.groupName,
            groupIcon: data.groupIcon,
            countRecipe: data.countRecipe,
        });
        return group;
    }
    async getGroups(userId) {
        const groupData = await groupModel.find({ user: userId });
        return groupData;
    }
}

module.exports = new RecipeService();