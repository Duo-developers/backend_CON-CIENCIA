import Reminder from "../models/reminder.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { sendReminderEmail } from "../../config/sengrid.js";

export const createReminder = async (req, res) => {
    try {
        const reminder = new Reminder(req.body);
        await reminder.save();

        const user = await User.findById(reminder.user);
        const event = await Event.findById(reminder.event);

        if (!user || !event) {
        return res.status(404).json({ message: "User or event not found" });
        }

        if (reminder.notificationMethod === "email") {
        await sendReminderEmail({
            to: user.email,
            subject: `Recordatorio: ${event.name}`,
            text: `Hola ${user.name}, recuerda que el evento "${event.name}" se llevará a cabo el ${new Date(event.date).toLocaleString()}.`
        });
        }

        res.status(201).json({
        message: "Reminder created and email sent",
        reminder
        });

    } catch (error) {
        res.status(500).json({
        message: "Failed to create reminder",
        error: error.message
        });
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