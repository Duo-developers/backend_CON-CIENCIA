import User from './user.model.js';
import { hash, verify } from 'argon2';


export const getUsers = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;

        const query = { status: true };

        const [users, total] = await Promise.all([
            User.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .select('-password -__v'),
            User.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: err.message
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findById(uid).select('-password -__v');
        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: err.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { password, email, username, ...otherData } = req.body;

        let user = await User.findById(uid);
        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        if (email && email !== user.email) {
            const emailInUse = await User.findOne({ email, _id: { $ne: uid } });
            if (emailInUse) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already in use by another user"
                });
            }
        }
        
        if (username && username !== user.username) {
            const usernameInUse = await User.findOne({ username, _id: { $ne: uid } });
            if (usernameInUse) {
                return res.status(400).json({
                    success: false,
                    message: "This username is already in use by another user"
                });
            }
        }
        
        const updateData = { ...otherData };
        if (email) updateData.email = email;
        if (username) updateData.username = username;

        user = await User.findByIdAndUpdate(uid, updateData, { new: true });
        
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: err.message
        });
    }
}
export const updatePassword = async (req, res) => {
    try {
        const { usuario } = req;
        const { currentPassword, newPassword } = req.body;

        const isPasswordValid = await verify(usuario.password, currentPassword);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                msg: "Current password does not match"
            });
        }
        
        const isSamePassword = await verify(usuario.password, newPassword);

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                msg: "The new password cannot be the same as the previous one"
            });
        }

        const encryptedPassword = await hash(newPassword);
        await User.findByIdAndUpdate(usuario._id, { password: encryptedPassword });

        return res.status(200).json({
            success: true,
            msg: "Password updated successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: err.message
        });
    }
};

export const updateMe = async (req, res) => {
    try {
        const { usuario } = req;
        const { password, dpi, email, username, ...otherData } = req.body;

        const userFound = await User.findById(usuario._id);
        if (!userFound || !userFound.status) {
            return res.status(404).json({
                success: false,
                msg: "User not found or inactive"
            });
        }

        if (email && email !== userFound.email) {
            const emailInUse = await User.findOne({ email, _id: { $ne: usuario._id } });
            if (emailInUse) {
                return res.status(400).json({
                    success: false,
                    msg: "This email is already in use by another user"
                });
            }
        }

        if (username && username !== userFound.username) {
            const usernameInUse = await User.findOne({ username, _id: { $ne: usuario._id } });
            if (usernameInUse) {
                return res.status(400).json({
                    success: false,
                    msg: "This username is already in use by another user"
                });
            }
        }

        const updateData = { ...otherData };
        if (email) updateData.email = email;
        if (username) updateData.username = username;

        const updatedUser = await User.findByIdAndUpdate(usuario._id, updateData, { new: true });

        return res.status(200).json({
            success: true,
            msg: "User updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                username: updatedUser.username
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Error updating user",
            error: err.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const userFound = await User.findById(uid);
        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deactivating user',
            error: err.message
        });
    }
}

export const updateProfilePicture = async (req, res) => {
    try{
        const { usuario } = req;
        const data = req.body;

        if(!req.img){ 
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        data.perfil = req.img; 

        const userFound = await User.findById(usuario._id);

        if (!userFound ) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(usuario._id, { perfil: data.perfil }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePicture: updatedUser.perfil
        });
        
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error: err.message
        });
    }
}

export const getUserLogged = async (req, res) => {
    try {
        const { usuario } = req;

        const user = await User.findById(usuario._id).select('-password -__v');

        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error fetching logged user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user data',
            error: error.message
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === role) {
            return res.status(200).json({
                success: true,
                message: 'User already has this role. No update was necessary.',
                user: {
                    id: user._id,
                    name: user.name,
                    role: user.role
                }
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: err.message
        });
    }
};

export const addFavoriteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { usuario } = req;

        const user = await User.findById(usuario._id);

        if (user.favorites.includes(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Event is already in favorites'
            });
        }

        user.favorites.push(eventId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Event added to favorites successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding event to favorites',
            error: error.message
        });
    }
};

export const removeFavoriteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { usuario } = req;

        await User.findByIdAndUpdate(usuario._id, { $pull: { favorites: eventId } });

        return res.status(200).json({
            success: true,
            message: 'Event removed from favorites successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error removing event from favorites',
            error: error.message
        });
    }
};

export const getFavoriteEvents = async (req, res) => {
    try {
        const { usuario } = req;

        const user = await User.findById(usuario._id).populate('favorites');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            favorites: user.favorites
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching favorite events',
            error: error.message
        });
    }
};
