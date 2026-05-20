"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdParamValidation = exports.taskIdValidation = exports.taskStatusUpdateValidation = exports.taskUpdateValidation = exports.taskCreateValidation = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("./validate");
const mongoose_1 = require("mongoose");
exports.taskCreateValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Task title is required'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Task description is required'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['todo', 'in-progress', 'completed'])
        .withMessage('Status must be todo, in-progress, or completed'),
    (0, express_validator_1.body)('dueDate')
        .notEmpty()
        .withMessage('Due date is required')
        .isISO8601()
        .withMessage('Due date must be a valid date format'),
    (0, express_validator_1.body)('assignedTo')
        .notEmpty()
        .withMessage('Assignee is required')
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid assignee User ID');
        }
        return true;
    }),
    (0, express_validator_1.body)('project')
        .notEmpty()
        .withMessage('Project is required')
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid Project ID');
        }
        return true;
    }),
    validate_1.validate,
];
exports.taskUpdateValidation = [
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
    (0, express_validator_1.body)('description').optional().trim().notEmpty().withMessage('Task description cannot be empty'),
    (0, express_validator_1.body)('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    (0, express_validator_1.body)('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
    (0, express_validator_1.body)('dueDate').optional().isISO8601().withMessage('Due date must be a valid date format'),
    (0, express_validator_1.body)('assignedTo')
        .optional()
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid assignee User ID');
        }
        return true;
    }),
    validate_1.validate,
];
exports.taskStatusUpdateValidation = [
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['todo', 'in-progress', 'completed'])
        .withMessage('Status must be todo, in-progress, or completed'),
    validate_1.validate,
];
exports.taskIdValidation = [
    (0, express_validator_1.param)('id')
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid task ID format');
        }
        return true;
    }),
    validate_1.validate,
];
exports.projectIdParamValidation = [
    (0, express_validator_1.param)('projectId')
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid project ID format');
        }
        return true;
    }),
    validate_1.validate,
];
