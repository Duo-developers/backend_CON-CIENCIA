import { body, param } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { articleExists } from "../helpers/db-validators.js";

export const validCategories = ['Biology', 'Chemistry', 'History', 'Medicine', 'Astronomy']

export const createArticleValidator = [
    validateJWT,
    hasRoles("TEACHER_ROLE", "ADMIN_ROLE"),
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category es required"
        .isIn(validCategories).withMessage(`Invalid category type. Valid types are: ${validCategories.join(", ")}`)
    ),
    validateField,
    deleteFileOnError,
    handleErrors
]

export const getArticlesValidator = [
    handleErrors
]

export const getArticleByIdValidator = [
    param("id").isMongoId().withMessage("The id is not valid"),
    param("id").custom(articleExists),
    validateField,
    handleErrors
]

export const updateArticleValidator = [
    param("id").isMongoId().withMessage("The id is not valid"),
    param("id").custom(articleExists)
]

