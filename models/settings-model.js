const { Schema, model } = require('mongoose');

const SettingsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    diameter: { type: Array },
    height: { type: Array },
    cakeWeightUpToTight: { type: Array },
    standWeight: { type: Array },
    leveledCakeWeight: { type: Array },
    weightOfCoveredCake: { type: Array },
    size: { type: Array },
    square: { type: Array },
    amountCream: { type: Array },
    amountMastic: { type: Array },
});

module.exports = model('Settings', SettingsSchema);
