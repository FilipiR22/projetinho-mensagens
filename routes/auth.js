import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js'; // Adicione a extensão .js se for um módulo local
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await usuario.checkPassword(senha))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'senha', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    res.json({ token });
});

export default router;