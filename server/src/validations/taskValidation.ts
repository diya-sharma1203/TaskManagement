import { body, param } from 'express-validator';
import { validate } from './validate';
import { Types } from 'mongoose';

export const taskCreateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date format'),

  body('assignedTo')
    .notEmpty()
    .withMessage('Assignee is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid assignee User ID');
      }
      return true;
    }),

  body('project')
    .notEmpty()
    .withMessage('Project is required')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Project ID');
      }
      return true;
    }),

  validate,
];

export const taskUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Task description cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date format'),
  body('assignedTo')
    .optional()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid assignee User ID');
      }
      return true;
    }),
  validate,
];

export const taskStatusUpdateValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
  validate,
];

export const taskIdValidation = [
  param('id')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid task ID format');
      }
      return true;
    }),
  validate,
];

export const projectIdParamValidation = [
  param('projectId')
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid project ID format');
      }
      return true;
    }),
  validate,
];
