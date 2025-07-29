import { body, param } from 'express-validator';
import { validateField } from './validate-fileds.js';


export const createReminderValidator = [
    param('id', 'El ID del evento en la URL no es válido').isMongoId(),
    body('notificationMethod', 'El método de notificación es requerido').notEmpty(),
    body('reminderTime', 'La fecha del recordatorio debe ser una fecha válida').isISO8601(),
    validateField,
];

export const getMyRemindersValidator = [
    validateField,
];

export const getReminderByIdValidator = [
    param('id', 'Invalid reminder ID').isMongoId(),
    validateField,
];

export const deleteReminderValidator = [
    param('id', 'El ID del recordatorio no es válido').isMongoId(),
    validateField,
];