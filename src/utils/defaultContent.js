import User from '../user/user.model.js';
import Event from '../event/event.model.js';
import Article from '../article/article.model.js';
import Comment from '../comment/comment.model.js';

export const createDefaultEvents = async () => {
    try {
        const eventCount = await Event.countDocuments();
        if (eventCount > 0) return; 

        console.log('--- Creando eventos por defecto ---');
        const admin = await User.findOne({ role: 'ADMIN_ROLE' });
        if (!admin) {
            console.log('No se encontró al admin para asignar eventos.');
            return;
        }

        const events = [
            { name: 'Noche de Estrellas: Observando Saturno', date: new Date('2025-09-15T20:00:00'), location: 'Observatorio Nacional', description: 'Observación telescópica de Saturno y sus anillos.', category: 'Astronomy', user: admin._id },
            { name: 'Taller de Cristalografía Casera', date: new Date('2025-10-22T15:00:00'), location: 'Laboratorio Kinal', description: 'Aprende a crear cristales de azúcar y sal en casa.', category: 'Chemistry', user: admin._id },
            { name: 'Charla: El ADN y la Herencia Genética', date: new Date('2025-11-05T18:00:00'), location: 'Auditorio Central', description: 'Una introducción a los secretos del ADN.', category: 'Biology', user: admin._id },
            { name: 'Conferencia: Avances en la Vacunación', date: new Date('2025-11-18T11:00:00'), location: 'Facultad de Medicina', description: 'Discusión sobre las nuevas tecnologías en vacunas.', category: 'Medicine', user: admin._id },
            { name: 'Debate: La Caída del Imperio Romano', date: new Date('2025-12-01T19:00:00'), location: 'Salón de Historia', description: 'Análisis de las causas políticas y sociales.', category: 'History', user: admin._id },
        ];

        await Event.insertMany(events);
        console.log(`✅ ${events.length} eventos creados exitosamente.`);
        console.log('--- Creación de eventos finalizada ---');
    } catch (error) {
        console.error('Error al crear eventos por defecto:', error);
    }
};

export const createDefaultArticlesAndComments = async () => {
    try {
        const articleCount = await Article.countDocuments();
        if (articleCount > 0) return;

        console.log('--- Creando artículos y comentarios por defecto ---');
        const teacher = await User.findOne({ role: 'TEACHER_ROLE' });
        const student = await User.findOne({ role: 'USER_ROLE' });

        if (!teacher || !student) {
            console.log('No se encontraron los usuarios (teacher/user) para crear contenido.');
            return;
        }

        const articlesData = [
            { title: '¿Qué son los Agujeros Negros?', content: 'Un agujero negro es una región del espacio...', author: teacher._id, category: 'Astronomy' },
            { title: 'La Tabla Periódica: Guía para Principiantes', content: 'La tabla periódica organiza los elementos...', author: teacher._id, category: 'Chemistry' },
            { title: 'El Cerebro: Nuestro Universo Interno', content: 'El cerebro humano es el órgano más complejo...', author: teacher._id, category: 'Biology' },
            { title: 'Los Virus: ¿Están Vivos?', content: 'Este es uno de los grandes debates de la biología...', author: teacher._id, category: 'Medicine' },
            { title: 'La Relatividad de Einstein Explicada', content: 'La teoría de la relatividad revolucionó nuestra...', author: teacher._id, category: 'History' },
        ];

        for (const articleData of articlesData) {
            const newArticle = new Article(articleData);
            await newArticle.save();

            const comments = [
                { message: '¡Qué artículo tan fascinante! Aprendí mucho.', author: student._id, article: newArticle._id },
                { message: 'Excelente explicación, profesor. ¿Podría recomendar más lecturas sobre el tema?', author: student._id, article: newArticle._id },
            ];
            
            await Comment.insertMany(comments);
        }
        
        console.log(`✅ ${articlesData.length} artículos y ${articlesData.length * 2} comentarios creados.`);
        console.log('--- Creación de contenido finalizada ---');

    } catch (error) {
        console.error('Error al crear artículos por defecto:', error);
    }
};
