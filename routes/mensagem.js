// routes/mensagem.js
const express = require('express');
const router = express.Router();
const Mensagem = require('../models/mensagens');
const authMiddleware = require('../middlewares/authMiddleware');

// Criar mensagem
router.post('/', authMiddleware, async (req, res) => {
    const { conteudo } = req.body;

    try {
        const novaMensagem = await Mensagem.create({ conteudo, idusuario: req.usuario.id });
        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar mensagem', detalhes: error.message });
    }
});

// Listar mensagens do usuário logado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const mensagens = await Mensagem.findAll({ where: { idusuario: req.usuario.id } });
        res.json(mensagens);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar mensagens', detalhes: error.message });
    }
});

// Obter uma mensagem específica do usuário
router.get('/:id', authMiddleware, async (req, res) => {
    const mensagem = await Mensagem.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
});

// Atualizar conteúdo da mensagem (mas não o idusuario!)
router.put('/:id', authMiddleware, async (req, res) => {
    const mensagem = await Mensagem.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

    try {
        await mensagem.update({ conteudo: req.body.conteudo });
        res.json(mensagem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar mensagem', detalhes: error.message });
    }
});

// Excluir mensagem
router.delete('/:id', authMiddleware, async (req, res) => {
    const mensagem = await Mensagem.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

    await mensagem.destroy();
    res.json({ mensagem: 'Mensagem excluída com sucesso' });
});

module.exports = router;
