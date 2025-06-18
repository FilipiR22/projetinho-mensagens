const express = require('express');
const router = express.Router();
const Mensagens = require('../models/mensagens');
const auth = require('../middlewares/auth');

router.use(auth);

// GET todas as mensagens
router.get('/', async (req, res, next) => {
    try {
        const mensagens = await Mensagens.findAll();
        // Mapeia para content
        const mapped = mensagens.map(m => ({
            id: m.id,
            content: m.conteudo,
            userId: m.userId // ajuste se necessário
        }));
        res.json(mapped);
    } catch (error) {
        next(error);
    }
});

// GET uma mensagem por ID
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const mensagem = await Mensagens.findByPk(id);
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

// POST nova mensagem
router.post('/', async (req, res, next) => {
    try {
        const conteudo = req.body.content || req.body.conteudo;

        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }

        const novaMensagem = await Mensagens.create({ conteudo, userId: req.user.id });
        res.status(201).json(novaMensagem);
    } catch (error) {
        next(error);
    }
});

// PUT atualizar mensagem
router.put('/:id', async (req, res, next) => {
    try {
        const mensagemId = parseInt(req.params.id);
        let { conteudo, id, ...rest } = req.body; // ignora id enviado no body

        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }

        const mensagem = await Mensagens.findByPk(mensagemId);
        if (!mensagem) {
            const err = new Error('Mensagem não encontrada');
            err.status = 404;
            throw err;
        }

        // Atualiza apenas o conteúdo, nunca o id
        await mensagem.update({ conteudo});
        res.status(200).json({ mensagem: 'Mensagem atualizada com sucesso', dados: mensagem });
    } catch (error) {
        next(error);
    }
});

// DELETE mensagem
router.delete('/:id', async (req, res, next) => {
    try {
        const deleteId = parseInt(req.params.id);
        const mensagem = await Mensagens.findByPk(deleteId);
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