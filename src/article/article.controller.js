import Article from './article.model.js'
import User from '../user/user.model.js'
import { getYoutubeEmbedUrl } from '../helpers/embed-conversor.js'

export const createArticle = async (req, res) => {
    try {
        const data = req.body;
        const { usuario } = req; 

        const { videos, ...restData } = data;

        const articleData = {
            ...restData,
            author: usuario._id,
            videos: Array.isArray(videos) ? videos.map(getYoutubeEmbedUrl).filter(Boolean) : []
        };

        const newArticle = await Article.create(articleData);

        return res.status(201).json({
            message: "Article created successfully",
            success: true,
            data: newArticle
        });
    } catch (err) {
        return res.status(500).json({
            message: "Article creation failed",
            success: false,
            error: err.message
        });
    }
};

export const getArticles = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;
        const articles = await Article.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(Number(from))
            .limit(Number(limit));

        return res.status(200).json({
            message: "Articles retrieved successfully",
            success: true,
            data: articles
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve articles",
            success: false,
            error: error.message
        });
        
    }
}

export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id).populate('author', 'name email');

        if (!article) {
            return res.status(404).json({
                message: "Article not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Article retrieved successfully",
            success: true,
            data: article
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve article",
            success: false,
            error: error.message
        });
    }
}

export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario } = req;
        const { videos, ...restData } = req.body;

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found",
                success: false,
            });
        }

        if (article.author.toString() !== usuario._id.toString() && usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                message: "You are not authorized to update this article",
                success: false,
            });
        }

        const updateData = { ...restData };
        if (Array.isArray(videos)) {
            updateData.videos = videos.map(getYoutubeEmbedUrl).filter(Boolean);
        }

        const updatedArticle = await Article.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Article updated successfully",
            success: true,
            data: updatedArticle,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update article",
            success: false,
            error: error.message,
        });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario } = req;

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found",
                success: false
            });
        }

        if (article.author.toString() !== usuario._id.toString() && usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                message: "You are not authorized to delete this article",
                success: false
            });
        }

        await Article.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Article deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete article",
            success: false,
            error: error.message
        });
    }
};

export const getMyArticles = async (req, res) => {
    try {
        const { usuario } = req;
        const { limit = 10, from = 0 } = req.query;

        const articles = await Article.find({ author: usuario._id })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(Number(from))
            .limit(Number(limit));

        return res.status(200).json({
            message: "Your articles retrieved successfully",
            success: true,
            data: articles
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve your articles",
            success: false,
            error: error.message
        });
    }
};