import { body, param } from 'express-validator';
import { validateField } from './validate-fileds.js';


export const createReminderValidator = [
    body('event', 'Event is required').isMongoId(),
    body('notificationMethod', 'Notification method is required').notEmpty(),
    body('reminderTime', 'Reminder time must be a valid date').isISO8601(),
    validateField,
];

export const getMyRemindersValidator = [
    validateField,
];

export const getReminderByIdValidator = [
    param('id', 'Invalid reminder ID').isMongoId(),
    validateField,
];