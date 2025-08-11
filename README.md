¡Entendido! Comprendo perfectamente el estilo que buscas: más directo, centrado en las funcionalidades y sin los elementos visuales como badges o tablas de contenido.

He reestructurado completamente el README para que se ajuste al ejemplo que me proporcionaste, combinando la información de tu proyecto "CON-CIENCIA" con ese formato.

Aquí tienes la nueva versión del README:

CON-CIENCIA API 🔬🔭
This is the backend for CON-CIENCIA, a web platform that integrates an Interactive Scientific Blog and a Scientific Event Organizer. Developed with Node.js, Express, and MongoDB, it provides functionalities for administrators, teachers, and general users to create, share, and discuss scientific content and events.

Key Features
Secure Authentication: Login system based on JSON Web Tokens (JWT) and password hashing with argon2. Includes a secure password recovery flow via email.

Role-Based Access Control: Differentiates between ADMIN_ROLE, TEACHER_ROLE, and USER_ROLE to control access to features like creating articles or managing events.

Full User Management: Administrators can list, update, and deactivate user profiles. Users can update their own profile information, password, and profile picture.

Article & Content System: Teachers and Admins can perform full CRUD operations on scientific articles. Articles are organized by categories (Physics, Biology, etc.) and can include embedded YouTube videos.

Interactive Commenting: Registered users can post, edit, and delete comments on articles, creating a space for community discussion. Admins and article authors also have moderation rights over comments.

Event & Reminder Management: Teachers and Admins can create and manage scientific events. Users can add events to a personal favorites list and set email reminders, which are sent automatically using a service worker.

Cloud Media Handling: Integrates with Cloudinary for seamless upload and management of user profile pictures.

API Security: Implements helmet for protection against common web vulnerabilities, cors to allow requests from the frontend, and express-rate-limit to prevent brute-force attacks.

Interactive API Documentation: Provides a complete and interactive API documentation using Swagger (OpenAPI).

Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Framework for building the REST API.

MongoDB: NoSQL database for data storage.

Mongoose: ODM for modeling the application's data.

JSON Web Tokens (JWT): For generating access tokens.

Argon2: For secure password hashing.

Express Validator: For validating incoming data on API routes.

Cloudinary: For cloud-based image management.

SendGrid: For transactional email delivery (password resets, reminders).

Dotenv: For managing environment variables.

Morgan: For HTTP request logging.

Helmet: For securing Express apps by setting various HTTP headers.

Installation and Setup
Follow these steps to get the project running in a local environment.

Prerequisites

Node.js (version 14 or higher) installed.

A running instance of MongoDB.

Steps

Clone the repository:

Bash

git clone https://github.com/Duo-developers/backend_CON-CIENCIA.git
cd backend_CON-CIENCIA
Install dependencies:

Bash

npm install
Set up environment variables: Create a .env file in the project root and add the following variables.

Fragmento de código

# Server
PORT=3001

# Database
URI_MONGO=your_mongodb_connection_string

# Security
SECRETORPRIVATEKEY=your_super_secret_jwt_key

# Cloudinary Service
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=your_verified_sendgrid_email

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Default User Passwords (for initial seeding)
DEFAULT_ADMIN_PASSWORD=your_default_admin_pass
DEFAULT_TEACHER_PASSWORD=your_default_teacher_pass
DEFAULT_USER_PASSWORD=your_default_user_pass
Start the server:

For a production environment:

Bash

npm start
For a development environment with auto-reloading:

Bash

npm run dev
Upon startup, the application will automatically create default users, articles, and events if the database is empty.

Default Users
Administrator:

Email: emiliojo.lux@gmail.com

Username: Elux

Password: The one you set in DEFAULT_ADMIN_PASSWORD

Teacher:

Email: teacher@conciencia.com

Username: ProfeCiencia

Password: The one you set in DEFAULT_TEACHER_PASSWORD

User:

Email: user@conciencia.com

Username: CarlSaganFan

Password: The one you set in DEFAULT_USER_PASSWORD







