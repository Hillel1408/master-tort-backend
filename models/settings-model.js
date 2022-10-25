const { Schema, model } = require('mongoose');

const SettingsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    diameter: { type: Number },
    height: { type: Number },
    cakeWeightUpToTight: { type: Number },
    standWeight: { type: Number },
    leveledCakeWeight: { type: Number },
    weightOfCoveredCake: { type: Number },
});

module.exports = model('Settings', SettingsSchema);
