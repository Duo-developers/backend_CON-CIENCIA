
import { Router } from 'express';
import { getUsersValidator, getUserByIdValidator, updateUserValidator, deleteUserValidatorAdmin, updateProfilePictureValidator, updatePasswordValidator, updateRoleValidator, getUserLoggedValidator } from '../middlewares/user-validator.js';
import { getUsers, getUserById, updateUser, updatePassword, updateMe, deleteUser, updateProfilePicture, updateRole, getUserLogged } from './user.controller.js';
import { uploadProfileImage } from '../middlewares/multer-uploads.js';
import { cloudinaryUploadSingle } from '../middlewares/image-uploads.js';

const router = Router();

// Routes for the logged-in user
router.get('/me', getUserLoggedValidator, getUserLogged);
router.put('/me', updateUserValidator, updateMe);
router.patch('/me/profile-picture', uploadProfileImage.single('image'), cloudinaryUploadSingle("profile-pictures"), updateProfilePictureValidator, updateProfilePicture);
router.patch('/password', [updateUserValidator, updatePasswordValidator], updatePassword);

// Admin routes
router.get('/', getUsersValidator, getUsers);
router.get('/:uid', getUserByIdValidator, getUserById);
router.put('/:uid', updateUserValidator, updateUser);
router.patch('/:uid/role', updateRoleValidator, updateRole); 
router.delete('/:uid', deleteUserValidatorAdmin, deleteUser);


export default router;
user-validator.js
