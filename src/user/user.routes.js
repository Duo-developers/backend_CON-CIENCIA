// src/user/user.routes.js

import { Router } from 'express';
import { getUsersValidator, getUserByIdValidator, updateUserValidator, deleteUserValidatorAdmin, updateProfilePictureValidator, updatePasswordValidator } from '../middlewares/user-validator.js';
import { getUsers, getUserById, updateUser, updatePassword, updateMe, deleteUser, updateProfilePicture} from './user.controller.js';
import { uploadProfileImage } from '../middlewares/multer-uploads.js';
import { cloudinaryUploadSingle } from '../middlewares/image-uploads.js';

const router = Router();

router.put('/me', updateUserValidator, updateMe);
router.patch('/me/profile-picture', uploadProfileImage.single('image'), cloudinaryUploadSingle("profile-pictures"), updateProfilePictureValidator, updateProfilePicture);
router.get('/', getUsersValidator, getUsers);
router.get('/:uid', getUserByIdValidator, getUserById);
router.put('/:uid', updateUserValidator, updateUser);
router.patch('/password/:uid', [updateUserValidator, updatePasswordValidator], updatePassword); // Corregí el middleware aquí también
router.delete('/:uid', deleteUserValidatorAdmin, deleteUser);

export default router;