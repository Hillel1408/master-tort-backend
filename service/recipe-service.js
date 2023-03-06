const groupModel = require('../models/recipe-groups-model');
const recipeModel = require('../models/recipe-model');
const calculationService = require('./calculation-service');
var ObjectId = require('mongodb').ObjectID;

class RecipeService {
    async createGroup(data) {
        //создаем группу рецептов
        const group = await groupModel.create({
            user: data.userId,
            ...data,
        });
        return group;
    }

    async getGroups(userId) {
        //получаем группы пользователя
        const groupData = await groupModel.find({ user: userId });
        return groupData;
    }

    async removeGroups(groupId) {
        //удаляем все рецепты удаляемой группы
        await recipeModel.deleteMany({
            group: ObjectId(groupId),
        });
        //удаляем саму группу
        await groupModel.deleteOne({
            _id: ObjectId(groupId),
        });
        return {
            success: true,
        };
    }

    async createRecipe(data) {
        //создаем новый рецепт
        const recipeData = await recipeModel.create({
            user: data.userId,
            ...data,
        });
        const groupData = await groupModel.findOne({
            _id: ObjectId(data.group),
        });
        //обновляем количество рецептов в группе созданного рецепта
        groupData.countRecipe = groupData.countRecipe + 1;
        await groupData.save();
        return recipeData;
    }

    async getRecipes(userId) {
        //получаем рецепты пользователя
        const recipeData = await recipeModel.find({ user: userId });
        return recipeData;
    }

    async getRecipe(recipeId) {
        //получаем рецепт пользователя
        const recipeData = await recipeModel.findOne({
            _id: ObjectId(recipeId),
        });
        return recipeData;
    }

    async removeRecipe(recipId) {
        //удаляем рецепт пользователя
        const recipeData = await recipeModel.find({ _id: ObjectId(recipId) });
        const groupData = await groupModel.findOne({
            _id: ObjectId(recipeData[0].group),
        });
        //уменьщаем количество рецептов в рубрике удаляемого рецепта
        groupData.countRecipe = groupData.countRecipe - 1;
        await groupData.save();
        await recipeModel.deleteOne({
            _id: ObjectId(recipId),
        });
        return {
            success: true,
        };
    }

    async update(id, data) {
        //обновляем рецепт
        const recipeData = await recipeModel.findOne({
            _id: ObjectId(id),
        });
        Object.keys(data).map((key) => {
            if (key === 'recipeUrl') {
                //если пользователь прислал новую картинку то обновляем ее
                if (data.recipeUrl) {
                    recipeData.recipeUrl = data.recipeUrl;
                }
            } else recipeData[key] = data[key];
        });
        //если заказ для расчетов
        if (data.checkbox && !isCream) {
            //то высчитываем и записываем общий объем
            recipeData.totalVolume = calculationService.size(
                data.diameter,
                data.height
            );
            //и площадь поверхности
            recipeData.square = calculationService.square(
                data.diameter,
                data.height
            );
        }
        await recipeData.save();
        return {
            success: true,
        };
    }
}

module.exports = new RecipeService();
