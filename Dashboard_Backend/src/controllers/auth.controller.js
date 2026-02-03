const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuarios.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

const register = async (req, res) => {
    try {
        const { nombre, apellidos, email, password } = req.body;

        if (!nombre || !apellidos || !email || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios' });
        }

        const existingUser = await usuariosModel.getUsuarioByEmail(email);
        if (existingUser) {
            return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await usuariosModel.createUsuario({
            nombre,
            apellidos,
            email,
            password: hashedPassword,
            rol: 'docente', // Por defecto registro de docentes
            estado: 'activo'
        });

        res.status(201).json({ ok: true, mensaje: 'Usuario registrado correctamente', data: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error verificando usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await usuariosModel.getUsuarioByEmail(email);
        if (!user) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        if (!user.password) {
             return res.status(400).json({ ok: false, mensaje: 'Usuario sin contraseña configurada. Contacte al admin.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ ok: false, mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // No devolver password
        delete user.password;
        delete user.token_recuperacion;
        delete user.token_expiracion;

        res.json({ ok: true, mensaje: 'Login exitoso', token, usuario: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error en el servidor' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await usuariosModel.getUsuarioByEmail(email);
        if (!user) {
            return res.status(404).json({ ok: false, mensaje: 'Email no encontrado' });
        }

        // Generar token simple
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiracion = new Date();
        expiracion.setHours(expiracion.getHours() + 1); // 1 hora validez

        await usuariosModel.saveRecoveryToken(email, token, expiracion);

        // MOCK EMAIL
        console.log('==================================================');
        console.log(`📧 RECUPERACIÓN DE CONTRASEÑA para ${email}`);
        console.log(`🔗 Link (Simulado): http://localhost:4200/reset-password?token=${token}`);
        console.log('==================================================');

        res.json({ ok: true, mensaje: 'Correo de recuperación enviado (Revisa la consola del servidor)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error procesando solicitud' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await usuariosModel.getUsuarioByToken(token);

        if (!user) {
            return res.status(400).json({ ok: false, mensaje: 'Token inválido o expirado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await usuariosModel.updatePassword(user.id_usuario, hashedPassword);

        res.json({ ok: true, mensaje: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error procesando solicitud' });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };
