const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        //регистрируем пользователя
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const { email, password, fullName, city } = req.body;
            const userData = await userService.registration(
                email,
                password,
                fullName,
                city
            );
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        //логиним пользователя
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async resetPassword(req, res, next) {
        //сброс и создание нового пароля пользователя
        try {
            const { email } = req.body;
            const userData = await userService.resetPassword(email);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activatePassword(req, res, next) {
        //активация нового пароля по ссылке из письма
        try {
            const activationLink = req.params.link;
            await userService.activatePassword(activationLink);
            return res.redirect(`${process.env.CLIENT_URL}/login`);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        //логаут пользователя
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        //активация аккаунта пользователя по ссылке из письма
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        //аутентификация пользователя
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        //обновление личных настроек пользователя
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const userData = await userService.update(req.body);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async updatePassword(req, res, next) {
        //обновление пароля пользователя
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const userData = await userService.updatePassword(req.body);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activateEmail(req, res, next) {
        //активация нового почтового ящика пользователя по ссылке из письма
        try {
            const activationLink = req.params.link;
            await userService.activateEmail(activationLink);
            return res.redirect(`${process.env.CLIENT_URL}/personal-settings`);
        } catch (e) {
            next(e);
        }
    }

    async updateOrder(req, res, next) {
        //обновление срочного заказа пользователя
        try {
            const userData = await userService.updateOrder(req.body);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
