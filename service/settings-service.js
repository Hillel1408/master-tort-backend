var ObjectId = require('mongodb').ObjectID;
const calculationService = require('./calculation-service');
const settingsModel = require('../models/settings-model');
const SettingsDto = require('../dtos/settings-dto');

class SettingsService {
    async create(data) {
        //создаем настройки пользователя
        const settingsData = await settingsModel.findOne({
            user: ObjectId(data.user),
        });
        //для удобства создаем массивы значений
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
        const arr_5 = [data.weightOfCoveredCake[0], data.leveledCakeWeight[0]];
        //расчитываем общий объем
        const size = [
            calculationService.size(...arr),
            calculationService.size(...arr_2),
        ];
        //расчитываем площадь поверхности
        const square = [
            calculationService.square(...arr),
            calculationService.square(...arr_2),
        ];
        //расчитываем количество крема
        const amountCream = [
            calculationService.amountCream(...arr_3),
            calculationService.amountCream(...arr_4),
        ];
        const amountMastic = [calculationService.amountMastic(...arr_5), ''];
        //если настройки уже существую то перезаписывем их
        if (settingsData) {
            Object.keys(data).map((key) => {
                if (key !== 'user') settingsData[key] = data[key];
            });
            settingsData.size = size;
            settingsData.square = square;
            settingsData.amountCream = amountCream;
            settingsData.amountMastic = amountMastic;
            await settingsData.save();
            return {
                success: true,
            };
        }
        //если настройки не существуют то создаем их
        const settings = await settingsModel.create({
            ...data,
            size: size,
            square: square,
            amountCream: amountCream,
            amountMastic: amountMastic,
        });
        return {
            success: true,
        };
    }

    async get(user) {
        //получаем настройки пользователя
        const settingsData = await settingsModel.findOne({ user });
        //убираем из них всякий мусор
        const settingsDto = new SettingsDto(settingsData);
        return settingsDto;
    }
}

module.exports = new SettingsService();
