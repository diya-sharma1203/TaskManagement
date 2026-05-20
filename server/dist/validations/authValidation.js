"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("./validate");
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'member'])
        .withMessage('Role must be either admin or member'),
    validate_1.validate,
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate_1.validate,
];
