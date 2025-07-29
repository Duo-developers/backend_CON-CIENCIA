import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js"; 
import {
    createReminderValidator,
    getMyRemindersValidator,
    getReminderByIdValidator
} from "../middlewares/reminder-validator.js";
import {
    createReminder,
    getMyReminders,
    getReminderById,
} from "./reminder.controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Reminder:
 *       type: object
 *       required:
 *         - event
 *         - user
 *         - notificationMethod
 *         - reminderTime
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del recordatorio
 *         event:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *           description: Evento relacionado al recordatorio
 *         user:
 *           type: string
 *           description: ID del usuario propietario del recordatorio
 *         notificationMethod:
 *           type: string
 *           enum: [email, calendar]
 *           description: Método de notificación del recordatorio
 *         reminderTime:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora programada para el recordatorio
 *         status:
 *           type: boolean
 *           description: Estado del recordatorio (activo/inactivo)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     ReminderRequest:
 *       type: object
 *       required:
 *         - notificationMethod
 *         - reminderTime
 *       properties:
 *         notificationMethod:
 *           type: string
 *           enum: [email, calendar]
 *           description: Método de notificación del recordatorio
 *         reminderTime:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora programada para el recordatorio
 */

const router = Router();

/**
 * @swagger
 * /conciencia/v1/reminder:
 *   get:
 *     summary: Obtener todos mis recordatorios
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recordatorios del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reminders retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reminder'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", [validateJWT, ...getMyRemindersValidator], getMyReminders);

/**
 * @swagger
 * /conciencia/v1/reminder/{id}:
 *   get:
 *     summary: Obtener un recordatorio específico por ID
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del recordatorio
 *     responses:
 *       200:
 *         description: Recordatorio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reminder retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Reminder'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Recordatorio no encontrado o no pertenece al usuario
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", [validateJWT, ...getReminderByIdValidator], getReminderById);

/**
 * @swagger
 * /conciencia/v1/reminder/{id}:
 *   post:
 *     summary: Crear un nuevo recordatorio para un evento
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento para el cual se crea el recordatorio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReminderRequest'
 *     responses:
 *       201:
 *         description: Recordatorio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Recordatorio creado con éxito."
 *                 reminder:
 *                   $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acción no permitida
 *       500:
 *         description: Error interno del servidor
 */
router.post("/:id", [validateJWT, ...createReminderValidator], createReminder);

export default router;