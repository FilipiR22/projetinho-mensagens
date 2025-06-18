const express = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await usuario.findOne({ where: { email } });
        if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

        const novoUsuario = await usuario.create({ name, email, password });
        return res.status(201).json({ id: novoUsuario.id, email: novoUsuario.email, name: novoUsuario.name });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao registrar' });
    }
});

// Fazer login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuarioEncontrado = await usuario.findOne({ where: { email } });
        if (!usuarioEncontrado) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ id: usuarioEncontrado.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        return res.json({
            token
        });
    } catch (err) {
        return res.status(401).json({ error: 'Erro ao logar'});
    }
});

module.exports = router;
