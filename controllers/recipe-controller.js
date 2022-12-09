const recipeService = require('../service/recipe-service');

class RecipeController {
    async createGroup(req, res, next) {
        try {
            const data = req.body;
            const groupData = await recipeService.createGroup(data);
            return res.json(groupData);
        } catch (e) {
            next(e);
        }
    }

    async getGroups(req, res, next) {
        try {
            const userId = req.params.id;
            const groupsData = await recipeService.getGroups(userId);
            return res.json(groupsData);
        } catch (e) {
            next(e);
        }
    }

    async removeGroups(req, res, next) {
        try {
            const groupId = req.params.id;
            const response = await recipeService.removeGroups(groupId);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async createRecipe(req, res, next) {
        try {
            const data = req.body;
            const recipeData = await recipeService.createRecipe(data);
            return res.json(recipeData);
        } catch (e) {
            next(e);
        }
    }

    async getRecipes(req, res, next) {
        try {
            const userId = req.params.id;
            const recipeData = await recipeService.getRecipes(userId);
            return res.json(recipeData);
        } catch (e) {
            next(e);
        }
    }

    async getRecipe(req, res, next) {
        try {
            const recipeId = req.params.id;
            const recipeData = await recipeService.getRecipe(recipeId);
            return res.json(recipeData);
        } catch (e) {
            next(e);
        }
    }

    async removeRecipe(req, res, next) {
        try {
            const recipeId = req.params.id;
            const response = await recipeService.removeRecipe(recipeId);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async updateRecipe(req, res, next) {
        try {
            const recipeId = req.params.id;
            const recipeData = await recipeService.update(recipeId, req.body);
            return res.json(recipeData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RecipeController();
