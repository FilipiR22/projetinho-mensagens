// filepath: [comentario.js](http://_vscodecontentref_/8)
const express = require('express');
const router = express.Router();
const Comentario = require('../models/comentario');

// Listar comentários de uma mensagem
router.get('/:idmensagem', async (req, res) => {
    try {
        const comentarios = await Comentario.findAll({
            where: { idmensagem: req.params.idmensagem },
            order: [['datahora', 'ASC']]
        });
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// Criar novo comentário
router.post('/:idmensagem', async (req, res) => {
    try {
        const { conteudo } = req.body;
        const novoComentario = await Comentario.create({
            conteudo,
            idusuario: req.usuario.id,
            idmensagem: req.params.idmensagem,
            datahora: new Date()
        });
        res.status(201).json(novoComentario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
});

module.exports = router;