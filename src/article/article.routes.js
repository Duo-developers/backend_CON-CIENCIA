import { Router } from 'express';
import {
    createArticleValidator,
    getArticlesValidator,
    getArticleByIdValidator,
    updateArticleValidator,
    deleteArticleValidator
} from '../middlewares/article-validator.js';
import {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from './article.controller.js';


const router = Router();

router.get('/', getArticlesValidator, getArticles);


router.get('/:id', getArticleByIdValidator, getArticleById);

router.delete('/:id', deleteArticleValidator, deleteArticle);

router.put('/:id', updateArticleValidator, updateArticle);


router.post('/', createArticleValidator, createArticle);

export default router;
