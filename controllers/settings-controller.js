const settingsService = require('../service/settings-service');

class SettingsController {
    async createSettings(req, res, next) {
        try {
            const settingsData = await settingsService.create(req.body);
            return res.json(settingsData);
        } catch (e) {
            next(e);
        }
    }
    async getSettings(req, res, next) {
        try {
            const userId = req.params.id;
            const settingsData = await settingsService.get(userId);
            return res.json(settingsData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SettingsController();
