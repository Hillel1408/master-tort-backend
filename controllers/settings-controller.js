const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const settingsService = require('../service/settings-service');

class SettingsController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Ошибка при валидации', errors.array())
                );
            }
            const settingsData = await settingsService.create(
                req.body.userId,
                req.body.diameter,
                req.body.height,
                req.body.cakeWeightUpToTight,
                req.body.standWeight,
                req.body.leveledCakeWeight,
                req.body.weightOfCoveredCake
            );
            return res.json(settingsData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SettingsController();
