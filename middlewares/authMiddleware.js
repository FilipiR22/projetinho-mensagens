import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const [, token] = authHeader.split(' ');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'senha');
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
}

export function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        if (!roles.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: 'Acesso negado: perfil insuficiente' });
        }
        next();
    };
}