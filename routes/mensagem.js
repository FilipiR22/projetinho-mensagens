const express = require('express');
const router = express.Router();
const { Mensagens } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas abaixo exigem autenticação
router.use(authMiddleware);

// GET todas as mensagens do usuário autenticado
router.get('/', async (req, res, next) => {
    try {
        const mensagens = await Mensagens.findAll({ where: { usuarioId: req.usuarioId } });
        res.json(mensagens);
    } catch (error) {
        next(error);
    }
});

// GET uma mensagem por ID (só se for do usuário)
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const mensagem = await Mensagens.findOne({ where: { id, usuarioId: req.usuarioId } });
        if (!mensagem) {
            const err = new Error('Mensagem não encontrada');
            err.status = 404;
            throw err;
        }
        res.status(200).json(mensagem);
    } catch (error) {
        next(error);
    }
});

// POST nova mensagem (associa ao usuário autenticado)
router.post('/', async (req, res, next) => {
    try {
        const { conteudo } = req.body;
        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }
        const novaMensagem = await Mensagens.create({ conteudo, usuarioId: req.usuarioId });
        res.status(201).json(novaMensagem);
    } catch (error) {
        next(error);
    }
});

// PUT atualizar mensagem (não altera usuarioId)
router.put('/:id', async (req, res, next) => {
    try {
        const mensagemId = parseInt(req.params.id);
        const { conteudo } = req.body;
        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }
        const mensagem = await Mensagens.findOne({ where: { id: mensagemId, usuarioId: req.usuarioId } });
        if (!mensagem) {
            const err = new Error('Mensagem não encontrada');
            err.status = 404;
            throw err;
        }
        await mensagem.update({ conteudo }); // usuarioId não é alterado
        res.status(200).json({ mensagem: 'Mensagem atualizada com sucesso', dados: mensagem });
    } catch (error) {
        next(error);
    }
});

// DELETE mensagem (só do usuário)
router.delete('/:id', async (req, res, next) => {
    try {
        const deleteId = parseInt(req.params.id);
        const mensagem = await Mensagens.findOne({ where: { id: deleteId, usuarioId: req.usuarioId } });
        if (!mensagem) {
            const err = new Error('Mensagem não encontrada');
            err.status = 404;
            throw err;
        }
        await mensagem.destroy();
        res.status(200).json({ mensagem: 'Mensagem deletada com sucesso' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;