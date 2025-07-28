export default function adminMiddleware(req, res, next) {
    if (req.user && req.user.perfil === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ erro: 'Acesso restrito para administradores.' });
}