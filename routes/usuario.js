// routes/usuario.js
const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const router = express.Router();

// Criar usuário
router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await Usuario.create({ nome, email, senha: senhaHash });
        res.status(201).json(novoUsuario);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao cadastrar usuário', detalhes: err.message });
    }
});

// Listar todos os usuários
router.get('/', async (req, res) => {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'nome', 'email'] });
    res.json(usuarios);
});

// Obter usuário por ID
router.get('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nome', 'email'] });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
    const { nome, email } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    try {
        await usuario.update({ nome, email });
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao atualizar usuário', detalhes: err.message });
    }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    await usuario.destroy();
    res.json({ mensagem: 'Usuário excluído com sucesso' });
});

module.exports = router;