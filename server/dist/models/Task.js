"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed'],
        default: 'todo',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: true },
});
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
