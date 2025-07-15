// src/utils/defaultUser.js

import User from '../user/user.model.js';
import { hash } from 'argon2';

export const createDefaultAdmin = async () => {
    try {
        // Verifica si ya existe un usuario con este correo o nombre de usuario
        const existingUser = await User.findOne({
            $or: [{ email: 'emilio@example.com' }, { username: 'emilio' }]
        });

        if (existingUser) {
            console.log('El usuario administrador por defecto ya existe.');
            return;
        }

        // Hashea la contraseña
        const hashedPassword = await hash('admin123'); // ¡Recuerda cambiar esta contraseña!

        // Crea el nuevo usuario administrador
        const defaultAdmin = new User({
            name: 'Emilio',
            username: 'emilio',
            email: 'emilio@example.com',
            password: hashedPassword,
            role: 'ADMIN_ROLE' // Asignamos el rol de administrador
        });

        await defaultAdmin.save();
        console.log('Usuario administrador por defecto creado exitosamente.');

    } catch (error) {
        console.error('Error al crear el usuario administrador por defecto:', error);
    }
};