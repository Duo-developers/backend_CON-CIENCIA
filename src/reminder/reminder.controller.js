import Reminder from './reminder.model.js';
import Event from '../event/event.model.js';
import User from '../user/user.model.js';
import { sendReminderEmail } from '../helpers/email-helpers.js'; 

export const createReminder = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { uid: userId } = req.user; 

        const [event, user] = await Promise.all([
            Event.findById(eventId),
            User.findById(userId)
        ]);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingReminder = await Reminder.findOne({ user: userId, event: eventId });
        if (existingReminder) {
            return res.status(409).json({ message: 'You have already set a reminder for this event' });
        }

        const reminder = new Reminder({
            user: userId,
            event: eventId,
            reminderDate: new Date()
        });

        await reminder.save();
        await sendReminderEmail(user.email, event);

        res.status(201).json({ 
            message: 'Reminder created successfully and confirmation email sent.', 
            reminder 
        });

    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ message: 'An error occurred on the server' });
    }
};

export const getMyReminders = async (req, res) => {
    try {
        const {usuario} = req;

        const reminders = await Reminder.find({ user: usuario._id })
        .populate('event', 'title date')
        .sort({ reminderTime: 1 });

        res.status(200).json({
        message: 'Reminders retrieved successfully',
        success: true,
        data: reminders,
        });
    } catch (error) {
        res.status(500).json({
        message: 'Error retrieving reminders',
        success: false,
        error: error.message,
        });
    }
};

export const getReminderById = async (req, res) => {
    try {
        const {usuario} = req;
        const { id } = req.params;

        const reminder = await Reminder.findOne({ _id: id, user: usuario._id })
        .populate('event', 'title date');

        if (!reminder) {
        return res.status(404).json({
            message: 'Reminder not found',
            success: false,
        });
        }

        res.status(200).json({
        message: 'Reminder retrieved successfully',
        success: true,
        data: reminder,
        });
    } catch (error) {
        res.status(500).json({
        message: 'Error retrieving reminder',
        success: false,
        error: error.message,
        });
    }
};