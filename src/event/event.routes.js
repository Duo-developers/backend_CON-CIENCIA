import { Router } from 'express';
import {
    createEventValidator,
    getEventsValidator,
    getEventByIdValidator,
    updateEventValidator,
    deleteEventValidator,
    getMyEventsValidator
} from '../middlewares/event-validator.js';

import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents
} from './event.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - location
 *         - description
 *         - category
 *       properties:
 *         eid:
 *           type: string
 *           description: ID único del evento
 *         name:
 *           type: string
 *           description: Nombre del evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del evento
 *         location:
 *           type: string
 *           description: Ubicación del evento
 *         description:
 *           type: string
 *           description: Descripción detallada del evento
 *         category:
 *           type: string
 *           enum: [Biology, Chemistry, History, Medicine, Astronomy]
 *           description: Categoría del evento
 *         user:
 *           type: string
 *           description: ID del usuario creador del evento
 *         externalLinks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del enlace
 *               url:
 *                 type: string
 *                 description: URL del enlace
 *           description: Enlaces externos relacionados con el evento
 *         status:
 *           type: boolean
 *           description: Estado del evento (activo/inactivo)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     EventRequest:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - location
 *         - description
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del evento
 *         location:
 *           type: string
 *           description: Ubicación del evento
 *         description:
 *           type: string
 *           description: Descripción detallada del evento
 *         category:
 *           type: string
 *           enum: [Biology, Chemistry, History, Medicine, Astronomy]
 *           description: Categoría del evento
 *         externalLinks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del enlace
 *               url:
 *                 type: string
 *                 description: URL del enlace
 *           description: Enlaces externos relacionados con el evento
 */

const router = Router();

/**
 * @swagger
 * /conciencia/v1/event:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de eventos a retornar
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de eventos a saltar
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Events fetched successfully"
 *                 total:
 *                   type: integer
 *                   description: Número total de eventos
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getEventsValidator, getAllEvents);

// Routes for authenticated users to get their own events
/**
 * @swagger
 * /conciencia/v1/event/my-events:
 *   get:
 *     summary: Obtener los eventos creados por el usuario autenticado
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de eventos a retornar
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de eventos a saltar
 *     responses:
 *       200:
 *         description: Lista de eventos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your events retrieved successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   description: Número total de eventos del usuario
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para acceder a este recurso
 *       500:
 *         description: Error del servidor
 */
router.get('/my-events', getMyEventsValidator, getMyEvents);

/**
 * @swagger
 * /conciencia/v1/event/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event fetched successfully"
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento no encontrado o inactivo
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getEventByIdValidator, getEventById);

/**
 * @swagger
 * /conciencia/v1/event:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventRequest'
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created"
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', createEventValidator, createEvent);

/**
 * @swagger
 * /conciencia/v1/event/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventRequest'
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: "Prohibido: No eres el propietario de este evento"
 *       404:
 *         description: "Evento no encontrado"
 *       500:
 *         description: "Error del servidor"
 */
router.put('/:id', updateEventValidator, updateEvent);

/**
 * @swagger
 * /conciencia/v1/event/{id}:
 *   delete:
 *     summary: Eliminar un evento (soft delete)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event soft-deleted successfully"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: "Prohibido: No estás autorizado para eliminar este evento"
 *       404:
 *         description: "Evento no encontrado"
 *       500:
 *         description: "Error del servidor"
 */
router.delete('/:id', deleteEventValidator, deleteEvent);

export default router;