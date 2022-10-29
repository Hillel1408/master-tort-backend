const settingsModel = require('../models/settings-model');
const SettingsDto = require('../dtos/settings-dto');

class SettingsService {
    async create({
        userId,
        diameter,
        height,
        cakeWeightUpToTight,
        standWeight,
        leveledCakeWeight,
        weightOfCoveredCake,
    }) {
        const settingsData = await settingsModel.findOne({ user: userId });
        if (settingsData) {
            settingsData.diameter = diameter;
            settingsData.height = height;
            settingsData.cakeWeightUpToTight = cakeWeightUpToTight;
            settingsData.standWeight = standWeight;
            settingsData.leveledCakeWeight = leveledCakeWeight;
            settingsData.weightOfCoveredCake = weightOfCoveredCake;
            return settingsData.save();
        }
        const settings = await settingsModel.create({
            user: userId,
            diameter,
            height,
            cakeWeightUpToTight,
            standWeight,
            leveledCakeWeight,
            weightOfCoveredCake,
        });
        return settings;
    }
    async get(userId) {
        const settingsData = await settingsModel.findOne({ user: userId });
        const settingsDto = new SettingsDto(settingsData);
        return settingsDto;
    }
}

module.exports = new SettingsService();
