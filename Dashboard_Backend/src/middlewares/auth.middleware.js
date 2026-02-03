const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ ok: false, mensaje: 'No se proporcionó token de autenticación' });
    }

    try {
        // Bearer <token>
        const bearer = token.split(' ');
        const tokenValue = bearer.length === 2 ? bearer[1] : token;

        const decoded = jwt.verify(tokenValue, JWT_SECRET);
        req.usuarioId = decoded.id;
        req.usuarioRol = decoded.rol;
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
    }
};

module.exports = verifyToken;
