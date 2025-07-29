import { Router } from 'express';
import {
    createEventValidator,
    getEventsValidator,
    getEventByIdValidator,
    updateEventValidator,
    deleteEventValidator
} from '../middlewares/event-validator.js';

import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from './event.controller.js';

const router = Router();

router.get('/', getEventsValidator, getAllEvents);

router.get('/:id', getEventByIdValidator, getEventById);

router.post('/', createEventValidator, createEvent);

router.put('/:id', updateEventValidator, updateEvent);

router.delete('/:id', deleteEventValidator, deleteEvent);

export default router;
