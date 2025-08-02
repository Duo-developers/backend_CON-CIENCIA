import { Router } from 'express';
import {
    createArticleValidator,
    getArticlesValidator,
    getArticleByIdValidator,
    updateArticleValidator,
    deleteArticleValidator,
    getMyArticlesValidator
} from '../middlewares/article-validator.js';
import {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getMyArticles
} from './article.controller.js';


/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *       properties:
 *         aid:
 *           type: string
 *           description: ID único del artículo
 *         title:
 *           type: string
 *           description: Título del artículo
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *           description: Usuario autor del artículo
 *         content:
 *           type: string
 *           description: Contenido del artículo
 *         category:
 *           type: string
 *           enum: [Biology, Chemistry, History, Medicine, Astronomy, Physics, Mathematics, Technology, Geology and Earth Sciences, Social Sciences, Engineering, Other]
 *           description: Categoría del artículo
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes asociadas
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de los videos asociados (embebidos)
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
 *           description: Estado del artículo (activo/inactivo)
 *     ArticleRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: Título del artículo
 *         content:
 *           type: string
 *           description: Contenido del artículo
 *         category:
 *           type: string
 *           enum: [Biology, Chemistry, History, Medicine, Astronomy, Physics, Mathematics, Technology, Geology and Earth Sciences, Social Sciences, Engineering, Other]
 *           description: Categoría del artículo
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes a asociar
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de los videos a asociar
 */

const router = Router();

// Routes for the logged-in user
/**
 * @swagger
 * /conciencia/v1/article:
 *   get:
 *     summary: Obtener todos los artículos
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de artículos a retornar
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de artículos a saltar
 *     responses:
 *       200:
 *         description: Lista de artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Articles retrieved successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getArticlesValidator, getArticles);

/**
 * @swagger
 * /conciencia/v1/article/{id}:
 *   get:
 *     summary: Obtener un artículo por ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article retrieved successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getArticleByIdValidator, getArticleById);

// Routes for authenticated users to get their own articles
/**
 * @swagger
 * /conciencia/v1/article/my-articles:
 *   get:
 *     summary: Obtener los artículos creados por el usuario autenticado
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de artículos a retornar
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de artículos a saltar
 *     responses:
 *       200:
 *         description: Lista de artículos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your articles retrieved successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para acceder a este recurso
 *       500:
 *         description: Error del servidor
 */
router.get('/my-articles', getMyArticlesValidator, getMyArticles);

// Admin teacher routes
/**
 * @swagger
 * /conciencia/v1/article/{id}:
 *   delete:
 *     summary: Eliminar un artículo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo a eliminar
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article deleted successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar este artículo
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteArticleValidator, deleteArticle);

/**
 * @swagger
 * /conciencia/v1/article/{id}:
 *   put:
 *     summary: Actualizar un artículo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleRequest'
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article updated successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar este artículo
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', updateArticleValidator, updateArticle);

/**
 * @swagger
 * /conciencia/v1/article:
 *   post:
 *     summary: Crear un nuevo artículo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleRequest'
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article created successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para crear artículos
 *       500:
 *         description: Error del servidor
 */
router.post('/', createArticleValidator, createArticle);

export default router;