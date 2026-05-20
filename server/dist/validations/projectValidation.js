"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdValidation = exports.projectCreateValidation = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("./validate");
const mongoose_1 = require("mongoose");
exports.projectCreateValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required'),
    (0, express_validator_1.body)('members')
        .optional()
        .isArray()
        .withMessage('Members must be an array of user IDs')
        .custom((value) => {
        if (value) {
            for (const id of value) {
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    throw new Error(`Invalid member ID: ${id}`);
                }
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'completed', 'on-hold'])
        .withMessage('Status must be active, completed, or on-hold'),
    validate_1.validate,
];
exports.projectIdValidation = [
    (0, express_validator_1.param)('id')
        .custom((value) => {
        if (!mongoose_1.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid project ID format');
        }
        return true;
    }),
    validate_1.validate,
];
