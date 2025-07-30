import { hash, verify } from "argon2"
import crypto from 'crypto';
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";
import { sendPasswordResetEmail } from "../../config/sengrid.js";
import { getResetPasswordEmailTemplate } from "../templates/reset-password-email.js";

export const register = async (req, res) => {
    try {
        const data = req.body;

        if (req.img) {
            data.perfil = req.img;
        }

        const encryptPassword = await hash(data.password);
        data.password = encryptPassword;

        const user = await User.create(data);

        const webToken = await generateJWT(user.id);

        return res.status(201).json({
            message: "You have successfully registered",
            success: true,
            userDetails: {
                email: user.email,
                img: user.perfil,
                token: webToken
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            success: false,
            error: err.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const genericErrorMsg = 'Invalid credentials'; 

        const user = await User.findOne({$or:[{email: email}, {username: username}]});
        if (!user) {
            return res.status(400).json({ success: false, message: genericErrorMsg });
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: genericErrorMsg });
        }

        const token = await generateJWT(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                username: user.username,
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: err.message
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email, status: true });

        if (!user) {
            return res.status(200).json({ 
                success: true,
                message: 'Si existe un usuario con este correo, se ha enviado un enlace para restablecer la contraseña.' 
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

        await user.save({ validateBeforeSave: false });

        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
        const resetUrl = `${frontendURL}/reset-password/${resetToken}`;

        const template = getResetPasswordEmailTemplate(resetUrl);
        await sendPasswordResetEmail(
            user.email, 
            template.subject, 
            template.text, 
            template.html
        );

        return res.status(200).json({ 
            success: true,
            message: 'Si existe un usuario con este correo, se ha enviado un enlace para restablecer la contraseña.' 
        });

    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Ocurrió un error en el servidor.' 
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'El token no es válido o ha expirado.' 
            });
        }

        const { password } = req.body;
        const encryptedPassword = await hash(password);
        user.password = encryptedPassword;
        
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        const webToken = await generateJWT(user.id);

        return res.status(200).json({ 
            success: true,
            message: 'La contraseña ha sido restablecida correctamente.',
            token: webToken
        });

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Ocurrió un error en el servidor.' 
        });
    }
};