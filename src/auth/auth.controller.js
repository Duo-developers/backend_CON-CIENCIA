import { hash, verify } from "argon2"
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

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