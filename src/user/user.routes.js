import { Router } from 'express';
import {
    getUsersValidator,
    getUserByIdValidator,
    updateUserValidator,
    deleteUserValidatorAdmin,
    updateProfilePictureValidator,
    updatePasswordValidator,
    updateRoleValidator,
    getUserLoggedValidator,
    favoriteEventValidator
} from '../middlewares/user-validator.js';
import {
    getUsers,
    getUserById,
    updateUser,
    updatePassword,
    updateMe,
    deleteUser,
    updateProfilePicture,
    updateRole,
    getUserLogged,
    addFavoriteEvent,
    removeFavoriteEvent,
    getFavoriteEvents
} from './user.controller.js';
import { uploadUserImg } from '../../config/cloudinary.js';
import { validateJWT } from '../middlewares/validate-jwt.js'; 


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único del usuario
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
 *         perfil:
 *           type: string
 *           description: URL de la imagen de perfil
 *         favorites:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de eventos favoritos
 *         status:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo)
 *         role:
 *           type: string
 *           enum: [USER_ROLE, TEACHER_ROLE, ADMIN_ROLE]
 *           description: Rol del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Contraseña actual
 *         newPassword:
 *           type: string
 *           description: Nueva contraseña
 *     UpdateRoleRequest:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [USER_ROLE, TEACHER_ROLE, ADMIN_ROLE]
 *           description: Nuevo rol del usuario
 */

const router = Router();

/**
 * @swagger
 * /conciencia/v1/user/me:
 *   get:
 *     summary: Obtener información del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/me', getUserLoggedValidator, getUserLogged);

/**
 * @swagger
 * /conciencia/v1/user/me:
 *   put:
 *     summary: Actualizar información del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/me', updateUserValidator, updateMe);

/**
 * @swagger
 * /conciencia/v1/user/me/profile-picture:
 *   patch:
 *     summary: Actualizar foto de perfil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de perfil
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
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
 *                   example: "Profile picture updated successfully"
 *                 profilePicture:
 *                   type: string
 *                   description: URL de la nueva imagen
 *       400:
 *         description: No se proporcionó imagen
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/me/profile-picture', uploadUserImg.single('image'), updateProfilePictureValidator, updateProfilePicture);

/**
 * @swagger
 * /conciencia/v1/user/password:
 *   patch:
 *     summary: Actualizar contraseña
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Contraseña actual incorrecta o nueva contraseña igual a la anterior
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.patch('/password', [updateUserValidator, updatePasswordValidator], updatePassword);

/**
 * @swagger
 * /conciencia/v1/user:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de usuarios a retornar
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de usuarios a saltar
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', getUsersValidator, getUsers);

/**
 * @swagger
 * /conciencia/v1/user/favorites:
 *   get:
 *     summary: Obtener los eventos favoritos del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/favorites', validateJWT, getFavoriteEvents);

/**
 * @swagger
 * /conciencia/v1/user/favorites/{eventId}:
 *   post:
 *     summary: Añadir un evento a favoritos
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a añadir a favoritos
 *     responses:
 *       200:
 *         description: Evento añadido a favoritos
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
 *                   example: "Event added to favorites successfully"
 *       400:
 *         description: El evento ya está en favoritos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/favorites/:eventId', favoriteEventValidator, addFavoriteEvent);

/**
 * @swagger
 * /conciencia/v1/user/favorites/{eventId}:
 *   delete:
 *     summary: Eliminar un evento de favoritos
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar de favoritos
 *     responses:
 *       200:
 *         description: Evento eliminado de favoritos
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
 *                   example: "Event removed from favorites successfully"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/favorites/:eventId', favoriteEventValidator, removeFavoriteEvent);


/**
 * @swagger
 * /conciencia/v1/user/{uid}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:uid', getUserByIdValidator, getUserById);

/**
 * @swagger
 * /conciencia/v1/user/{uid}:
 *   put:
 *     summary: Actualizar usuario por ID (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado
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
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:uid', updateUserValidator, updateUser);

/**
 * @swagger
 * /conciencia/v1/user/{uid}/role:
 *   patch:
 *     summary: Actualizar rol de usuario (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Rol actualizado
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
 *                   example: "User role updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Rol inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:uid/role', updateRoleValidator, updateRole); 

/**
 * @swagger
 * /conciencia/v1/user/{uid}:
 *   delete:
 *     summary: Desactivar usuario (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado
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
 *                   example: "User deactivated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:uid', deleteUserValidatorAdmin, deleteUser);


export default router;