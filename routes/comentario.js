import express from 'express';
import Comentario from '../models/comentario.js';
const router = express.Router({ mergeParams: true }); 

// Listar comentários de uma mensagem
router.get('/', async (req, res) => {
    try {
        const { idmensagem } = req.params;
        if (isNaN(parseInt(idmensagem))) {
            return res.status(400).json({ erro: 'ID da mensagem inválido.' });
        }
        const comentarios = await Comentario.findAll({
            where: { idmensagem },
            order: [['datahora', 'ASC']]
        });
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar comentários', details: err.message });
    }
});

// Criar novo comentário
router.post('/', async (req, res) => {
    const { conteudo } = req.body;
    if (!conteudo || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Conteúdo do comentário não pode ser vazio.' });
    }
    const idmensagem = parseInt(req.params.idmensagem);
    if (isNaN(idmensagem)) {
        return res.status(400).json({ erro: 'ID da mensagem inválido.' });
    }
    try {
        const novoComentario = await Comentario.create({
            conteudo,
            idusuario: req.usuario.id,
            idmensagem,
            datahora: new Date()
        });
        res.status(201).json(novoComentario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar comentário', details: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { conteudo } = req.body;
    if (!conteudo || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Conteúdo do comentário não pode ser vazio.' });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID do comentário inválido.' });
    }
    try {
        const comentario = await Comentario.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        // Só permite editar o próprio comentário
        if (comentario.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este comentário.' });
        }
        comentario.conteudo = conteudo;
        await comentario.save();
        res.json(comentario);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar comentário', details: err.message });
    }
});

export default router;