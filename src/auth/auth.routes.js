import { Router } from 'express';
import { registerValidator, loginValidator} from '../middlewares/user-validator.js';
import { register, login } from './auth.controller.js';
import { uploadProfileImage } from '../middlewares/multer-uploads.js';
import { cloudinaryUploadSingle } from '../middlewares/image-uploads.js';

const router = Router();

router.post('/register', uploadProfileImage.single("image"), cloudinaryUploadSingle("profile-pictures"), registerValidator, register);

router.post('/login', loginValidator, login);

export default router;