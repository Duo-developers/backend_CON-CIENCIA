import User from '../user/user.model.js';
import { hash } from 'argon2';

export const createDefaultAdmin = async () => {
    try {
        const adminEmail = 'emiliojo.lux@gmail.com';
        const adminUsername = 'Elux';

        const existingUser = await User.findOne({
            $or: [{ email: adminEmail }, { username: adminUsername }]
        });

        if (existingUser) {
            return;
        }

        const passwordFromEnv = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!passwordFromEnv) {
            console.error('Error: La contraseña del administrador por defecto no está definida en el archivo .env');
            return;
        }

        const hashedPassword = await hash(passwordFromEnv);

        const defaultAdmin = new User({
            name: 'Emilio',
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN_ROLE'
        });

        await defaultAdmin.save();
        console.log('Usuario administrador por defecto creado exitosamente.');

    } catch (error) {
        console.error('Error al crear el usuario administrador por defecto:', error);
    }
};