const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    dueDate: Date,
});

module.exports = mongoose.model('Project', ProjectSchema);
