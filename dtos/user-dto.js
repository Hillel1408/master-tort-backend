module.exports = class UserDto {
    email;
    id;
    isActivated;
    fullName;
    avatar;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.fullName = model.fullName;
        this.avatar = model.avatar;
    }
};
