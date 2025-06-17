const express = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const exists = await usuario.findOne({ where: { email } });
        if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

        const usuario = await usuario.create({ email, password });
        return res.status(201).json({ id: usuario.id, email: usuario.email });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao registrar' });
    }
});

// Fazer login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await usuario.findOne({ where: { email } });
        if (!usuario || !(await usuario.checkPassword(password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return res.json({
            usuario: { id: usuario.id, email: usuario.email },
            token
        });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao logar' });
    }
});

module.exports = router;
