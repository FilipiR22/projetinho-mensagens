const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

        const user = await User.create({ email, password });
        return res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao registrar' });
    }
});

// Fazer login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return res.json({
            user: { id: user.id, email: user.email },
            token
        });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao logar' });
    }
});

module.exports = router;
