const settingsModel = require('../models/settings-model');
const SettingsDto = require('../dtos/settings-dto');
var ObjectId = require('mongodb').ObjectID;

class SettingsService {
    async create(data) {
        const settingsData = await settingsModel.findOne({
            user: ObjectId(data.user),
        });

        const size = (diameter, height) => {
            const value = 3.14 * ((diameter / 2) * (diameter / 2)) * height;
            return value;
        };
        const square = (diameter, height) => {
            const value =
                2 * 3.14 * (diameter / 2) * height +
                3.14 * ((diameter / 2) * (diameter / 2));
            return value;
        };
        const amountCream = (
            cakeWeightUpToTight,
            standWeight,
            leveledCakeWeight
        ) => {
            const value = leveledCakeWeight - standWeight - cakeWeightUpToTight;
            return value;
        };

        const amountMastic = (weightOfCoveredCake, leveledCakeWeight) => {
            const value = weightOfCoveredCake - leveledCakeWeight;
            return value;
        };

        const arr = [data.diameter[0], data.height[0]];
        const arr_2 = [data.diameter[1], data.height[1]];
        const arr_3 = [
            data.cakeWeightUpToTight[0],
            data.standWeight[0],
            data.leveledCakeWeight[0],
        ];
        const arr_4 = [
            data.cakeWeightUpToTight[1],
            data.standWeight[1],
            data.leveledCakeWeight[1],
        ];

        if (settingsData) {
            Object.keys(data).map((key) => {
                if (key !== 'user') settingsData[key] = data[key];
            });
            settingsData.size = [size(...arr), size(...arr_2)];
            settingsData.square = [square(...arr), square(...arr_2)];
            settingsData.amountCream = [
                amountCream(...arr_3),
                amountCream(...arr_4),
            ];
            return settingsData.save();
        }
        const settings = await settingsModel.create({
            ...data,
            size: [size(...arr), size(...arr_2)],
            square: [square(...arr), square(...arr_2)],
            amountCream: [amountCream(...arr_3), amountCream(...arr_4)],
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
