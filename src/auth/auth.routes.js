import { Router } from 'express';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../middlewares/user-validator.js';
import { register, login, forgotPassword, resetPassword } from './auth.controller.js';
import { uploadProfileImage } from '../middlewares/multer-uploads.js';
import { cloudinaryUploadSingle } from '../middlewares/image-uploads.js';

const router = Router();

router.post('/register', uploadProfileImage.single("image"), cloudinaryUploadSingle("profile-pictures"), registerValidator, register);

router.post('/login', loginValidator, login);

router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);

export default router;