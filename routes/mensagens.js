import express from 'express';
import Mensagens from '../models/mensagens.js';
import { authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar mensagem (qualquer user autenticado)
router.post('/', async (req, res) => {
    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo || !titulo.trim() || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Título e conteúdo não podem ser vazios.' });
    }
    try {
        const novaMensagem = await Mensagens.create({ conteudo, idusuario: req.usuario.id });
        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar mensagem', detalhes: error.message, conteudoMensagem: conteudo });
    }
});

// Listar mensagens do usuário logado
router.get('/', async (req, res) => {
    try {
        const mensagensBuscadas = await Mensagens.findAll({ // Renomeado para camelCase
            where: { idusuario: req.usuario.id },
        });
        res.json(mensagensBuscadas);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// Obter uma mensagem específica do usuário
router.get('/:id', async (req, res) => {
    const mensagem = await Mensagens.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
});

// Atualizar mensagem
router.put('/:id', async (req, res) => {
    const mensagem = await Mensagens.findByPk(req.params.id);
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

    // ADMIN pode tudo, USER só se for dono
    if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
        return res.status(403).json({ error: 'Acesso negado: só pode alterar suas próprias mensagens' });
    }

    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo || !titulo.trim() || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Título e conteúdo não podem ser vazios.' });
    }

    try {
        await mensagem.update({ conteudo: req.body.conteudo });
        res.json(mensagem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar mensagem', detalhes: error.message });
    }
});

// Deletar mensagem
router.delete('/:id', async (req, res) => {
    const mensagem = await Mensagens.findByPk(req.params.id);
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

    if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
        return res.status(403).json({ error: 'Acesso negado: só pode deletar suas próprias mensagens' });
    }
    await mensagem.destroy();
    res.status(204).send();
});

export default router;