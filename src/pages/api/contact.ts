
import type { APIRoute } from 'astro';

import nodemailer from 'nodemailer'; // Importar Nodemailer
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

export const post: APIRoute = async ({ request }) => {
    // Leer los datos enviados por el formulario
    const formData = await request.formData();
    const nombre = formData.get('nombre')?.toString() || '';
    const fono = formData.get('fono')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const presupuesto = formData.get('presupuesto')?.toString() || '';
    const mensaje = formData.get('mensaje')?.toString() || '';

    // Validar datos básicos
    if (!nombre || !fono || !email || !presupuesto || !mensaje) {
        return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return new Response(JSON.stringify({ error: 'El email no es válido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Configuración del contenido del correo
    const emailContent = `
        Nombre: ${nombre}
        Teléfono: ${fono}
        Email: ${email}
        Plan Seleccionado: ${presupuesto}
        Mensaje: ${mensaje}
    `;

    try {
        // Configuración de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Cambia esto si usas otro servicio (e.g., Outlook, Yahoo)
            auth: {
                user: process.env.EMAIL_USER, // Cambia por tu email
                pass: process.env.EMAIL_PASS, // Cambia por tu contraseña (mejor usar variables de entorno)
            },
        });

        // Enviar el correo
        await transporter.sendMail({
            from: 'tuemail@gmail.com', // Dirección del remitente
            to: 'codigoraul@gmail.com', // Dirección del destinatario
            subject: 'Nuevo Mensaje del Formulario', // Asunto del correo
            text: emailContent, // Contenido del correo en texto plano
        });

        return new Response(
            JSON.stringify({ success: 'Mensaje enviado correctamente.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return new Response(JSON.stringify({ error: 'Error al enviar el mensaje.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const prerender = false;
