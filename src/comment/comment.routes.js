import { Router } from 'express';
import {
    createCommentValidator,
    editCommentValidator,
    deleteCommentValidator,
    getCommentsByArticleValidator
} from '../middlewares/comment-validator.js';
import {
    commentArticle,
    editComment,
    deleteComment,
    getCommentsByArticle
} from './comment.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - message
 *         - article
 *         - author
 *       properties:
 *         cid:
 *           type: string
 *           description: ID único del comentario
 *         message:
 *           type: string
 *           description: Contenido del comentario
 *         article:
 *           type: string
 *           description: ID del artículo al que pertenece
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *           description: Usuario autor del comentario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         status:
 *           type: boolean
 *           description: Estado del comentario (activo/inactivo)
 *     CommentRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Contenido del comentario
 */

const router = Router();

/**
 * @swagger
 * /conciencia/v1/comment/{id}:
 *   post:
 *     summary: Crear un nuevo comentario en un artículo
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo a comentar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentRequest'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
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
 *                   example: "Comment created successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Artículo o usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/:id', createCommentValidator, commentArticle);

/**
 * @swagger
 * /conciencia/v1/comment/{id}:
 *   put:
 *     summary: Editar un comentario existente
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentRequest'
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
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
 *                   example: "Comment updated successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar este comentario
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', editCommentValidator, editComment);

/**
 * @swagger
 * /conciencia/v1/comment/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
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
 *                   example: "Comment deleted successfully"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Comentario o artículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteCommentValidator, deleteComment);

/**
 * @swagger
 * /conciencia/v1/comment/article/{id}:
 *   get:
 *     summary: Obtener todos los comentarios de un artículo
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Lista de comentarios
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
 *                   description: Número total de comentarios
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error del servidor
 */
router.get('/article/:id', getCommentsByArticleValidator, getCommentsByArticle);

export default router;