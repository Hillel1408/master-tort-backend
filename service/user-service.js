const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const generator = require('generate-password');
var ObjectId = require('mongodb').ObjectID;

class UserService {
    async registration(email, password, fullName, city) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${email} уже существует`
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
            fullName,
            city,
        });
        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}`,
            password
        );

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Неверный логин или пароль');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный логин или пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async resetPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${email} не существует`
            );
        }
        const activationLink = uuid.v4();
        const password = generator.generate({
            length: 10,
            numbers: true,
        });
        const hashPassword = await bcrypt.hash(password, 3);
        user.activationLinkPassword = activationLink;
        user.newPassword = hashPassword;
        await mailService.sendResetPassword(
            email,
            `${process.env.API_URL}/api/reset-password/${activationLink}`,
            password,
            user.fullName
        );
        await user.save();
        const userDto = new UserDto(user);
        return userDto;
    }

    async activatePassword(activationLinkPassword) {
        const user = await UserModel.findOne({ activationLinkPassword });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации');
        }
        user.password = user.newPassword;
        await user.save();
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async update(data) {
        const user = await UserModel.findOne({ _id: ObjectId(data.userId) });
        if (data.image) user.avatar = data.image;
        user.fullName = data.fullName;
        if (data.email !== user.email) {
            const candidate = await UserModel.findOne({ email: data.email });
            if (candidate) {
                throw ApiError.BadRequest(
                    `Почтовый адрес ${data.email} принадлежит другому пользователю`
                );
            } else {
                const activationLink = uuid.v4();
                user.activationLinkEmail = activationLink;
                user.newEmail = data.email;
                await mailService.updateEmail(
                    data.email,
                    `${process.env.API_URL}/api/update/${activationLink}`,
                    user.fullName
                );
            }
        }
        await user.save();
        const userDto = new UserDto(user);
        return userDto;
    }

    async activateEmail(activationLinkEmail) {
        const user = await UserModel.findOne({ activationLinkEmail });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации');
        }
        user.email = user.newEmail;
        await user.save();
    }

    async updatePassword(data) {
        const user = await UserModel.findOne({ _id: ObjectId(data.userId) });
        const isPassEquals = await bcrypt.compare(data.password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        } else {
            const hashPassword = await bcrypt.hash(data.newPassword, 3);
            user.password = hashPassword;
            await user.save();
            return {
                success: true,
            };
        }
    }

    async updateOrder(data) {
        const user = await UserModel.findOne({ _id: ObjectId(data.userId) });
        user.rushOrder = data.rushOrder;
        await user.save();
        return {
            success: true,
        };
    }
}

module.exports = new UserService();
