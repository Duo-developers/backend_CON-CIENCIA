import { body, param } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { commentExists, articleExists } from "../helpers/db-validators.js";


export const createCommentValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("Article id is not valid"),
    param("id").custom(articleExists),
    body("message").notEmpty().withMessage("Message is required"),
    validateField,
    handleErrors
];

export const editCommentValidator = [
    validateJWT,
    param("articleId").isMongoId().withMessage("Article ID is not valid"),
    param("articleId").custom(articleExists),
    param("commentId").isMongoId().withMessage("Comment ID is not valid"),
    param("commentId").custom(commentExists),
    body("message").notEmpty().withMessage("Message is required"),
    
    validateField,
    handleErrors
];

export const deleteCommentValidator = [
    validateJWT,
    param("articleId").isMongoId().withMessage("Article ID is not valid"),
    param("articleId").custom(articleExists),
    param("commentId").isMongoId().withMessage("Comment ID is not valid"),
    param("commentId").custom(commentExists),
    validateField,
    handleErrors
];


export const getCommentsByArticleValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("Article id is not valid"),
    param("id").custom(articleExists),
    validateField,
    handleErrors
];
