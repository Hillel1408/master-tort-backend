const settingsService = require('../service/settings-service');

class SettingsController {
    async createSettings(req, res, next) {
        //создаем настойки пользователя
        try {
            const response = await settingsService.create(req.body);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getSettings(req, res, next) {
        //получаем настойки пользователя
        try {
            const user = req.params.id;
            const settingsData = await settingsService.get(user);
            return res.json(settingsData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SettingsController();
