const settingsModel = require('../models/settings-model');
const SettingsDto = require('../dtos/settings-dto');

class SettingsService {
    async create(data) {
        const settingsData = await settingsModel.findOne({ user: data.user });
        if (settingsData) {
            Object.keys(data).map((key) => {
                if (key != 'user') settingsData.key = data.key;
            });
            return settingsData.save();
        }
        const settings = await settingsModel.create({
            ...data,
        });
        return settings;
    }
    async get(user) {
        const settingsData = await settingsModel.findOne({ user });
        const settingsDto = new SettingsDto(settingsData);
        return settingsDto;
    }
}

module.exports = new SettingsService();
