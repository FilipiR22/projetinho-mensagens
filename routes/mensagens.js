import express from 'express';
import Mensagens from '../models/mensagens.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { autenticarJWT } from './auth.js'; // Certifique-se de exportar o middleware

const router = express.Router();

// Criar mensagem (qualquer user autenticado)
router.post('/', autenticarJWT, async (req, res) => {
    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo || !titulo.trim() || !conteudo.trim()) {
        return res.status(422).json({ erro: 'Título e conteúdo não podem ser vazios.' });
    }
    try {
        const novaMensagem = await Mensagens.create({
            titulo,
            conteudo,
            idusuario: req.usuario.id,
            data_criacao: new Date()
        });

        res.status(201).json({
            id: novaMensagem.id,
            titulo: novaMensagem.titulo,
            conteudo: novaMensagem.conteudo,
            usuario_id: novaMensagem.idusuario,
            data_criacao: novaMensagem.data_criacao
        });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar mensagem', detalhes: error.message, conteudoMensagem: conteudo });
    }
});

// Listar mensagens do usuário logado
router.get('/', autenticarJWT, async (req, res) => {
    try {
        let mensagens;
        if (req.usuario.perfil === 'ADMIN') {
            mensagens = await Mensagens.findAll();
        } else {
            mensagens = await Mensagens.findAll({ where: { idusuario: req.usuario.id } });
        }
        res.json(mensagens);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar mensagens' });
    }
});

// Obter uma mensagem específica do usuário
router.get('/:id', autenticarJWT, async (req, res) => {
    const mensagem = await Mensagens.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
});

// Atualizar mensagem (PUT)
router.put('/:id', autenticarJWT, async (req, res) => {
    try {
        const mensagem = await Mensagens.findByPk(req.params.id);
        if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

        // Só admin ou dono pode editar
        if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para alterar esta mensagem' });
        }

        if (!req.body.conteudo || !req.body.conteudo.trim()) {
            return res.status(422).json({ errors: { conteudo: ['Campo obrigatório.'] } });
        }

        mensagem.conteudo = req.body.conteudo;
        await mensagem.save();
        res.json({
            id: mensagem.id,
            titulo: mensagem.titulo,
            conteudo: mensagem.conteudo,
            usuario_id: mensagem.idusuario,
            data_criacao: mensagem.data_criacao
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
});

// Atualizar mensagem (PATCH)
router.patch('/:id', autenticarJWT, async (req, res) => {
    try {
        const mensagem = await Mensagens.findByPk(req.params.id);
        if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

        // Só admin ou dono pode editar
        if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para alterar esta mensagem' });
        }

        if ('conteudo' in req.body && (!req.body.conteudo || !req.body.conteudo.trim())) {
            return res.status(422).json({ errors: { conteudo: ['Campo obrigatório.'] } });
        }

        if (req.body.titulo !== undefined) mensagem.titulo = req.body.titulo;
        if (req.body.conteudo !== undefined) mensagem.conteudo = req.body.conteudo;

        await mensagem.save();
        res.json({
            id: mensagem.id,
            titulo: mensagem.titulo,
            conteudo: mensagem.conteudo,
            usuario_id: mensagem.idusuario,
            data_criacao: mensagem.data_criacao
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
});

// Deletar mensagem
router.delete('/:id', autenticarJWT, async (req, res) => {
    try {
        const mensagem = await Mensagens.findByPk(req.params.id);
        if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

        // Só admin ou dono pode deletar
        if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        await mensagem.destroy();
        res.json({ msg: 'Mensagem deletada' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar mensagem' });
    }
});

export default router;