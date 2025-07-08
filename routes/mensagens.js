import express from 'express';
import Mensagem from '../models/mensagens.js'; // Adicione a extensão .js
import authMiddleware from '../middlewares/authMiddleware.js'; // Adicione a extensão .js

const router = express.Router();

// Criar mensagem
router.post('/', async (req, res) => {
    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo || !titulo.trim() || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Título e conteúdo não podem ser vazios.' });
    }
    try {
        const novaMensagem = await Mensagem.create({ conteudo, idusuario: req.usuario.id });
        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar mensagem', detalhes: error.message, conteudoMensagem: conteudo });
    }
});

// Listar mensagens do usuário logado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const mensagensBuscadas = await Mensagem.findAll({ // Renomeado para camelCase
            where: { idusuario: req.usuario.id },
        });
        res.json(mensagensBuscadas);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// Obter uma mensagem específica do usuário
router.get('/:id', authMiddleware, async (req, res) => {
    const mensagem = await Mensagem.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
});

// Atualizar conteúdo da mensagem (mas não o idusuario!)
router.put('/:id', async (req, res) => {
    const { titulo, conteudo } = req.body;
    if (!titulo || !conteudo || !titulo.trim() || !conteudo.trim()) {
        return res.status(400).json({ erro: 'Título e conteúdo não podem ser vazios.' });
    }
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

export default router;