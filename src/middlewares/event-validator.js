import { body, param, query } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { eventExists } from "../helpers/db-validators.js"; // Debes crear esta función

export const validEventCategories = ['Biology', 'Chemistry', 'History', 'Medicine', 'Astronomy'];



export const createEventValidator = [
    validateJWT,
    hasRoles("TEACHER_ROLE", "ADMIN_ROLE"),
    body("name").notEmpty().withMessage("Name is required"),
    body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Date must be valid ISO 8601"),
    body("location").notEmpty().withMessage("Location is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required")
        .isIn(validEventCategories).withMessage(`Invalid category. Valid: ${validEventCategories.join(", ")}`),
    body("externalLinks").optional().isArray().withMessage("ExternalLinks must be an array"),
    body("externalLinks.*.title").notEmpty().withMessage("Each external link must have a title"),
    body("externalLinks.*.url").notEmpty().withMessage("Each external link must have a URL").isURL().withMessage("Each URL must be valid"),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const getEventsValidator = [
    handleErrors
];


export const getEventByIdValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("The id is not valid"),
    param("id").custom(eventExists),
    validateField,
    handleErrors
];

export const updateEventValidator = [
    validateJWT,
    hasRoles("TEACHER_ROLE", "ADMIN_ROLE"),
    param("id").isMongoId().withMessage("The id is not valid"),
    param("id").custom(eventExists),
    body("category").optional()
        .isIn(validEventCategories).withMessage(`Invalid category. Valid: ${validEventCategories.join(", ")}`),
    body("externalLinks").optional().isArray().withMessage("ExternalLinks must be an array"),
    body("externalLinks.*.title").optional().notEmpty().withMessage("Each external link must have a title"),
    body("externalLinks.*.url").optional().notEmpty().withMessage("Each external link must have a URL").isURL().withMessage("Each URL must be valid"),
    validateField,
    handleErrors
];

export const deleteEventValidator = [
    validateJWT,
    hasRoles("TEACHER_ROLE", "ADMIN_ROLE"),
    param("id").isMongoId().withMessage("The id is not valid"),
    param("id").custom(eventExists),
    validateField,
    handleErrors
];

export const getMyEventsValidator = [
    validateJWT,
    hasRoles("TEACHER_ROLE", "ADMIN_ROLE"),
    handleErrors
];
