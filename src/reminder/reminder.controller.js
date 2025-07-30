import { request, response } from 'express';
import Reminder from './reminder.model.js';
import Event from '../event/event.model.js';
import { sendReminderEmail } from '../../config/sengrid.js'; 
import { getEventReminderTemplate } from '../templates/event-reminder-email.js'; 


export const createReminder = async (req = request, res = response) => {
    const { id: eventId } = req.params;
    const { usuario } = req;
    const { reminderTime, notificationMethod } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event || !event.user || event.user.toString() !== usuario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no permitida.' });
        }

        const reminder = new Reminder({
            user: usuario._id,
            event: eventId,
            reminderTime,
            notificationMethod
        });

        await reminder.save(); 

        if (notificationMethod === 'email') {
            const templateData = {
                userName: usuario.name,
                eventName: event.name || 'tu evento',
                eventDate: new Date(event.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' }),
                eventUrl: `${process.env.FRONTEND_URL}/events/${event._id}`
            };

            const emailTemplate = getEventReminderTemplate(templateData);

            await sendReminderEmail(
                usuario.email,
                emailTemplate.subject,
                emailTemplate.html,
                emailTemplate.text
            );
        }

        return res.status(201).json({
            msg: 'Recordatorio creado con éxito.',
            reminder
        });

    } catch (error) {
        console.error('---- ERROR AL CREAR RECORDATORIO ----', error);
        return res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

export const getMyReminders = async (req = request, res = response) => {
    try {
        const { usuario } = req;
        const reminders = await Reminder.find({ user: usuario._id, status: true }) 
            .populate('event', 'name date')
            .sort({ reminderTime: 1 });

        return res.status(200).json({
            message: 'Reminders retrieved successfully',
            data: reminders,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving reminders',
            error: error.message,
        });
    }
};

export const getReminderById = async (req = request, res = response) => {
    try {
        const { usuario } = req;
        const { id } = req.params;

        const reminder = await Reminder.findOne({ _id: id, user: usuario._id, status: true }) // Solo activos
            .populate('event', 'name date'); 

        if (!reminder) {
            return res.status(404).json({
                message: 'Reminder not found or does not belong to you',
            });
        }

        return res.status(200).json({
            message: 'Reminder retrieved successfully',
            data: reminder,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving reminder',
            error: error.message,
        });
    }
};

export const deleteReminder = async (req = request, res = response) => {
    try {
        const { usuario } = req;
        const { id } = req.params;

        const reminder = await Reminder.findOne({ 
            _id: id, 
            user: usuario._id, 
            status: true 
        });

        if (!reminder) {
            return res.status(404).json({
                message: 'Reminder not found or does not belong to you',
            });
        }

        await Reminder.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Reminder deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting reminder:', error);
        return res.status(500).json({
            message: 'Error deleting reminder',
            error: error.message,
        });
    }
};
