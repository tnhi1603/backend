const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
    dueDate: Date,
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: Date,
    updateTime: Date,
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', TaskSchema);
