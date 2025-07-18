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

const router = Router();

router.post('/:id', createCommentValidator, commentArticle);

router.put('/:id', editCommentValidator, editComment);

router.delete('/:id', deleteCommentValidator, deleteComment);

router.get('/article/:id', getCommentsByArticleValidator, getCommentsByArticle);

export default router;
