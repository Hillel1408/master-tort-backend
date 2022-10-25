module.exports = class UserDto {
    email;
    id;
    isActivated;
    fullName;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.fullName = model.fullName;
    }
};
