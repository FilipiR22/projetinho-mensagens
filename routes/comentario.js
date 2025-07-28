import express from 'express';
import Comentario from '../models/comentario.js';

const router = express.Router({ mergeParams: true }); 

// Listar comentários de uma mensagem (pode ser público, se desejar)
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
    if (!req.usuario) {
        return res.status(401).json({ error: 'Não autenticado' });
    }
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

// Atualizar comentário
router.put('/:idComentario', async (req, res) => {
    try {
        const comentario = await Comentario.findByPk(req.params.idComentario);
        if (!comentario) return res.status(404).json({ erro: 'Comentário não encontrado' });

        // Só admin ou dono pode editar
        if (req.usuario.perfil !== 'ADMIN' && comentario.idusuario !== req.usuario.id) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        comentario.conteudo = req.body.conteudo || comentario.conteudo;
        await comentario.save();
        res.json(comentario);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao atualizar comentário' });
    }
});

// Deletar comentário
router.delete('/:idComentario', async (req, res) => {
    try {
        const comentario = await Comentario.findByPk(req.params.idComentario);
        if (!comentario) return res.status(404).json({ erro: 'Comentário não encontrado' });

        // Só admin ou dono pode deletar
        if (req.usuario.perfil !== 'ADMIN' && comentario.idusuario !== req.usuario.id) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        await comentario.destroy();
        res.json({ msg: 'Comentário deletado' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar comentário' });
    }
});

export default router;