import { body, param } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { emailExists, usernameExists, userExists } from "../helpers/db-validators.js";

export const registerValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("It is not a valid email"),
    body("email").custom(emailExists),
    body("password").notEmpty().withMessage("The password is required"),
    body("password").isStrongPassword({
        minLength: 8,
        minLowerCase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("The password must contain at least 8 characters and at least one lowercase letter, one uppercase letter, one number, and one symbol"),
    validateField,
    deleteFileOnError,
    handleErrors
]

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("username").optional().isString().withMessage("Username must be a string"),
    body("password", "Password is required").exists(),
    validateField,
    handleErrors
];


export const getUsersValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validateField,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];


export const deleteUserValidatorAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), 
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];
export const updateUserValidator = [
    validateJWT,
    body("name").optional().notEmpty().withMessage("Name is required"),
    body("email").optional().isEmail().withMessage("It is not a valid email"),
    body("email").optional().custom(emailExists),
    body("username").optional().notEmpty().withMessage("Username is required"),
    body("username").optional().custom(usernameExists),
    validateField,
    handleErrors
];
    

export const updatePasswordValidator = [
    validateJWT,
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
    body("newPassword").isStrongPassword({
        minLength: 8,
        minLowerCase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"),
    validateField,
    handleErrors
];

export const updateProfilePictureValidator = [
    validateJWT,
    validateField,
    handleErrors
]

export const updateRoleValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(userExists),
    body("role").isIn(['USER_ROLE', 'TEACHER_ROLE', 'ADMIN_ROLE']).withMessage("Invalid role"),
    validateField,
    handleErrors
];

export const getUserLoggedValidator = [
    validateJWT,
    handleErrors
];