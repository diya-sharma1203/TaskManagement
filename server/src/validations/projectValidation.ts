import { body, param } from 'express-validator';
import { validate } from './validate';
import { Types } from 'mongoose';

export const projectCreateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required'),

  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array of user IDs')
    .custom((value) => {
      if (value) {
        for (const id of value) {
          if (!Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid member ID: ${id}`);
          }
        }
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['active', 'completed', 'on-hold'])
    .withMessage('Status must be active, completed, or on-hold'),

  validate,
];

export const projectIdValidation = [
  param('id')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid project ID format');
      }
      return true;
    }),
  validate,
];
