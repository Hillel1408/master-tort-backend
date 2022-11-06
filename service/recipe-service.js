const groupModel = require('../models/recipe-groups-model');
const recipeModel = require('../models/recipe-model');
var ObjectId = require('mongodb').ObjectID;

class RecipeService {
    async createGroup(data) {
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

    async removeGroups(groupId) {
        await recipeModel.deleteMany({
            group: ObjectId(groupId),
        });
        await groupModel.deleteOne({
            _id: ObjectId(groupId),
        });
        return {
            success: true,
        };
    }

    async createRecipe(data) {
        const recipeData = await recipeModel.create({
            user: data.userId,
            ...data,
        });
        const groupData = await groupModel.findOne({
            _id: ObjectId(data.group),
        });
        groupData.countRecipe = groupData.countRecipe + 1;
        await groupData.save();
        return recipeData;
    }

    async getRecipe(userId) {
        const recipeData = await recipeModel.find({ user: userId });
        return recipeData;
    }

    async removeRecipe(recipId) {
        const recipeData = await recipeModel.find({ _id: ObjectId(recipId) });
        const groupData = await groupModel.findOne({
            _id: ObjectId(recipeData[0].group),
        });
        groupData.countRecipe = groupData.countRecipe - 1;
        await groupData.save();
        await recipeModel.deleteOne({
            _id: ObjectId(recipId),
        });
        return {
            success: true,
        };
    }
}

module.exports = new RecipeService();
