import Comment from './comment.model.js'
import User from '../user/user.model.js'
import Article from '../article/article.model.js'

export const commentArticle = async (req, res) => {
    try {
        const { message } = req.body;
        const { id } = req.params
        const { usuario } = req;

        const user = await User.findById(usuario._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const existingArticle = await Article.findById(id);
        if (!existingArticle) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        const newComment = await Comment.create({
            author: user._id,
            article: existingArticle._id,
            message
        });

        // Populate el autor para devolver información completa
        const populatedComment = await Comment.findById(newComment._id)
            .populate('author', 'username name perfil');

        return res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            comment: populatedComment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const editComment = async (req, res) => {
    try {
        const { id } = req.params; 
        const { message } = req.body;
        const { usuario } = req;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (comment.author.toString() !== usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own comments'
            });
        }

        comment.message = message;
        await comment.save();

        // Populate el autor para devolver información completa
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username name perfil');

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            comment: populatedComment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario } = req;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const article = await Article.findById(comment.article);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        const isCommentOwner = comment.author.toString() === usuario._id.toString();
        const isAdmin = usuario.role === 'ADMIN_ROLE';
        const isArticleAuthor = article.author.toString() === usuario._id.toString();

        if (!isCommentOwner && !isAdmin && !isArticleAuthor) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this comment'
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getCommentsByArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({ article: id, status: true })
            .populate('author', 'username name perfil')
            .sort({ createdAt: -1 }); 

        return res.status(200).json({
            success: true,
            total: comments.length,
            comments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
            .populate('author', 'username name perfil')
            .populate('article', 'title');

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        return res.status(200).json({
            success: true,
            comment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
