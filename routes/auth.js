import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';
import RefreshToken from '../models/refreshToken.js';

const router = express.Router();

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, perfil: user.perfil },
        process.env.JWT_SECRET || 'senha',
        { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, perfil: user.perfil },
        process.env.JWT_SECRET || 'senha',
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '15d' }
    );
}

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !(await usuario.checkPassword(senha))) {
            // Retorno conforme solicitado
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const accessToken = generateAccessToken(usuario);
        const refreshToken = generateRefreshToken(usuario);

        // Salva o refresh token no banco
        await RefreshToken.create({ token: refreshToken, userId: usuario.id });

        res.json({
            token: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login', detalhes: err.message });
    }
});

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token não fornecido' });
    }

    // Verifica se o refresh token existe no banco
    const tokenNoBanco = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!tokenNoBanco) {
        return res.status(401).json({ error: 'Refresh token inválido ou ausente' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'senha');
        // Inclui o perfil ao gerar novo access token
        const usuario = { id: decoded.id, email: decoded.email, perfil: decoded.perfil };
        const newAccessToken = generateAccessToken(usuario);

        res.json({ token: newAccessToken });
    } catch (err) {
        return res.status(401).json({ error: 'Refresh token expirado ou inválido' });
    }
});

export default router;