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



const router = Router();

router.get("/", [validateJWT, ...getMyRemindersValidator], getMyReminders);

router.get("/:id", [validateJWT, ...getReminderByIdValidator], getReminderById);

router.post("/:id", [validateJWT, ...createReminderValidator], createReminder);

export default router;