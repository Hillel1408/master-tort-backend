module.exports = class UserDto {
    diameter;
    height;
    cakeWeightUpToTight;
    standWeight;
    leveledCakeWeight;
    weightOfCoveredCake;

    constructor(model) {
        this.diameter = model.diameter;
        this.height = model.height;
        this.cakeWeightUpToTight = model.cakeWeightUpToTight;
        this.standWeight = model.standWeight;
        this.leveledCakeWeight = model.leveledCakeWeight;
        this.weightOfCoveredCake = model.weightOfCoveredCake;
    }
};
