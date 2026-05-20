import { body } from 'express-validator';
import { validate } from './validate';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['admin', 'member'])
    .withMessage('Role must be either admin or member'),
    
  validate,
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
];
