"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    status: {
        type: String,
        enum: ['active', 'completed', 'on-hold'],
        default: 'active',
    },
}, {
    timestamps: { createdAt: true, updatedAt: true },
});
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
