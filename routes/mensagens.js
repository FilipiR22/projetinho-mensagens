import express from 'express';
import Mensagens from '../models/mensagens.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

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
router.get('/:id', async (req, res) => {
    const mensagem = await Mensagens.findOne({ where: { id: req.params.id, idusuario: req.usuario.id } });
    if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(mensagem);
});

// Atualizar mensagem
router.put('/:id', async (req, res) => {
    try {
        const mensagem = await Mensagens.findByPk(req.params.id);
        if (!mensagem) return res.status(404).json({ erro: 'Mensagem não encontrada' });

        // Só admin ou dono pode editar
        if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        mensagem.conteudo = req.body.conteudo || mensagem.conteudo;
        await mensagem.save();
        res.json(mensagem);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao atualizar mensagem' });
    }
});

// Deletar mensagem
router.delete('/:id', async (req, res) => {
    try {
        const mensagem = await Mensagens.findByPk(req.params.id);
        if (!mensagem) return res.status(404).json({ erro: 'Mensagem não encontrada' });

        // Só admin ou dono pode deletar
        if (req.usuario.perfil !== 'ADMIN' && mensagem.idusuario !== req.usuario.id) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        await mensagem.destroy();
        res.json({ msg: 'Mensagem deletada' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar mensagem' });
    }
});

export default router;