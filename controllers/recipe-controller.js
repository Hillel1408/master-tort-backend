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
}

module.exports = new RecipeController();
