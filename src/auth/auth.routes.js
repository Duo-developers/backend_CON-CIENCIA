import { Router } from 'express';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../middlewares/user-validator.js';
import { register, login, forgotPassword, resetPassword } from './auth.controller.js';
import { uploadProfileImage } from '../middlewares/multer-uploads.js';
import { cloudinaryUploadSingle } from '../middlewares/image-uploads.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario alternativo para inicio de sesión
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             token:
 *               type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email para recuperación de contraseña
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: Nueva contraseña
 */

const router = Router();

/**
 * @swagger
 * /conciencia/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Authentication]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have successfully registered"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     img:
 *                       type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Datos de registro inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/register', uploadProfileImage.single("image"), cloudinaryUploadSingle("profile-pictures"), registerValidator, register);

/**
 * @swagger
 * /conciencia/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', loginValidator, login);

/**
 * @swagger
 * /conciencia/v1/auth/forgot-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Solicitud procesada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Si existe un usuario con este correo, se ha enviado un enlace para restablecer la contraseña."
 *       500:
 *         description: Error del servidor
 */
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);

/**
 * @swagger
 * /conciencia/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña con token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "La contraseña ha sido restablecida correctamente."
 *                 token:
 *                   type: string
 *       400:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);

export default router;