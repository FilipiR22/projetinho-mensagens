const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

router.get('/', async (req, res, next) => {
    try {
        const usuario = await Usuario.findAll();
        res.json(usuario);
    } catch (error) {
        next(error);
    }
});

// GET uma mensagem por ID
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const mensagem = await Usuario.findByPk(id);
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
        const { conteudo } = req.body;

        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }

        const novaMensagem = await Usuario.create({ conteudo });
        res.status(201).json(novaMensagem);
    } catch (error) {
        next(error);
    }
});

// PUT atualizar mensagem
router.put('/:id', async (req, res, next) => {
    try {
        const mensagemId = parseInt(req.params.id);
        const { conteudo } = req.body;

        if (!conteudo || conteudo.trim() === '') {
            const err = new Error('O conteúdo da mensagem é obrigatório e não pode estar vazio.');
            err.status = 400;
            throw err;
        }

        const mensagem = await Usuario.findByPk(mensagemId);
        if (!mensagem) {
            const err = new Error('Mensagem não encontrada');
            err.status = 404;
            throw err;
        }

        await mensagem.update({ conteudo });
        res.status(200).json({ mensagem: 'Mensagem atualizada com sucesso', dados: mensagem });
    } catch (error) {
        next(error);
    }
});

// DELETE mensagem
router.delete('/:id', async (req, res, next) => {
    try {
        const deleteId = parseInt(req.params.id);
        const mensagem = await Usuario.findByPk(deleteId);
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