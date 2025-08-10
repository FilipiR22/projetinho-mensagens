import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader|| !authHeader.startsWith('Bearer ') ||authHeader==undefined) {
        return res.status(401).json({ error: 'Token JWT ausente ou inválido' });
    }

    const [, token] = authHeader.split(' ');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'senha');
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token JWT ausente ou inválido' });
    }
}

export function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Token JWT ausente ou inválido' });
        }
        if (!roles.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }
        next();
    };
}