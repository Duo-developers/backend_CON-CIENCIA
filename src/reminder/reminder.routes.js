import { Router } from "express";
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

const router = Router();

router.get("/", getMyRemindersValidator, getMyReminders);
router.get("/:id", getReminderByIdValidator, getReminderById);
router.post("/", createReminderValidator, createReminder);

export default router;
