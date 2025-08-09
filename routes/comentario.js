import express from 'express';
import Comentario from '../models/comentario.js';
import Mensagens from '../models/mensagens.js';

const router = express.Router({ mergeParams: true }); 

// Listar comentários de uma mensagem
router.get('/', async (req, res) => {
    try {
        const { idmensagem } = req.params;
        if (isNaN(parseInt(idmensagem))) {
            return res.status(400).json({ erro: 'ID da mensagem inválido.' });
        }

        // Verifica se a mensagem existe
        const mensagem = await Mensagens.findByPk(idmensagem);
        if (!mensagem) {
            return res.status(404).json({ error: 'Mensagem/Comentário não encontrado' });
        }

        const comentarios = await Comentario.findAll({
            where: { idmensagem },
            order: [['datahora', 'ASC']]
        });
        res.status(200).json(comentarios);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar comentários', details: err.message });
    }
});

// Criar novo comentário
router.post('/', async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'Token JWT ausente ou inválido' });
    }
    const { conteudo } = req.body;
    if (!conteudo || !conteudo.trim()) {
        return res.status(422).json({ errors: { conteudo: ['Campo obrigatório.'] } });
    }
    const idmensagem = parseInt(req.params.idmensagem);
    if (isNaN(idmensagem)) {
        return res.status(400).json({ erro: 'ID da mensagem inválido.' });
    }

    // Verifica se a mensagem existe
    const mensagem = await Mensagens.findByPk(idmensagem);
    if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem/Comentário não encontrado' });
    }

    try {
        const novoComentario = await Comentario.create({
            conteudo,
            idusuario: req.usuario.id,
            idmensagem,
            datahora: new Date()
        });
        res.status(201).json({
            id: novoComentario.id,
            conteudo: novoComentario.conteudo,
            usuario_id: novoComentario.idusuario,
            mensagem_id: novoComentario.idmensagem,
            data_criacao: novoComentario.datahora
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar comentário', details: err.message });
    }
});

// Atualizar comentário
router.put('/:idComentario', async (req, res) => {
    try {
        const comentario = await Comentario.findByPk(req.params.idComentario);
        if (!comentario) return res.status(404).json({ error: 'Mensagem/Comentário não encontrado' });

        // Só admin ou dono pode editar
        if (req.usuario.perfil !== 'ADMIN' && comentario.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        if (!req.body.conteudo || !req.body.conteudo.trim()) {
            return res.status(422).json({ errors: { conteudo: ['Campo obrigatório.'] } });
        }

        comentario.conteudo = req.body.conteudo;
        await comentario.save();
        res.status(200).json({
            id: comentario.id,
            conteudo: comentario.conteudo,
            usuario_id: comentario.idusuario,
            mensagem_id: comentario.idmensagem,
            data_criacao: comentario.datahora
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
});

// Deletar comentário
router.delete('/:idComentario', async (req, res) => {
    try {
        const comentario = await Comentario.findByPk(req.params.idComentario);
        if (!comentario) {
            return res.status(404).json({ error: 'Mensagem/Comentário não encontrado' });
        }

        // Só admin ou dono pode deletar
        if (req.usuario.perfil !== 'ADMIN' && comentario.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        await comentario.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
});

export default router;