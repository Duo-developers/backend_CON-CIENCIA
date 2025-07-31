import User from '../user/user.model.js';
import { hash } from 'argon2';

const createUserIfNotExists = async (userData) => {
    try {
        const { email, username, password, role, name } = userData;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return;
        }

        if (!password) {
            console.error(`Error: La contraseña para '${username}' no está definida en el .env`);
            return;
        }

        const hashedPassword = await hash(password);
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        console.log(`✅ Usuario '${username}' con rol '${role}' creado exitosamente.`);

    } catch (error) {
        console.error(`Error al crear el usuario por defecto`, error);
    }
};

export const createDefaultUsers = async () => {
    console.log('--- Verificando usuarios por defecto ---');
    
    await createUserIfNotExists({
        name: 'Emilio',
        username: 'Elux',
        email: 'emiliojo.lux@gmail.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: 'ADMIN_ROLE'
    });

    await createUserIfNotExists({
        name: 'Profesor Altamirano',
        username: 'ProfeCiencia',
        email: 'teacher@conciencia.com',
        password: process.env.DEFAULT_TEACHER_PASSWORD,
        role: 'TEACHER_ROLE'
    });

    await createUserIfNotExists({
        name: 'Carl Sagan',
        username: 'CarlSaganFan',
        email: 'user@conciencia.com',
        password: process.env.DEFAULT_USER_PASSWORD,
        role: 'USER_ROLE'
    });

    console.log('--- Verificación de usuarios finalizada ---');
};