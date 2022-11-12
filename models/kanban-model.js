const { Schema, model } = require('mongoose');

const KanbanSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    inWork: { type: Array },
    purchase: { type: Array },
    ready: { type: Array },
    upcoming: { type: Array },
});

module.exports = model('Kanban', KanbanSchema);
