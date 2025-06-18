const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

    const [, token] = authHeader.split(' ');
    if (!token) return res.status(401).json({ erro: 'Token mal formatado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
};