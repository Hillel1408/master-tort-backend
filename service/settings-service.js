const settingsModel = require('../models/settings-model');

class SettingsService {
    async create(
        userId,
        diameter,
        height,
        cakeWeightUpToTight,
        standWeight,
        leveledCakeWeight,
        weightOfCoveredCake
    ) {
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
}

module.exports = new SettingsService();
