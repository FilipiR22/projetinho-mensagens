import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';

const router = express.Router();

// Criar usuário
router.post('/usuario', async (req, res) => {
    try {
        const { nome, email, senha, perfil } = req.body;
        if (!nome || !email || !senha) {
            return res.status(422).json({ errors: { nome: ['Campo obrigatório.'], email: ['Campo obrigatório.'], senha: ['Campo obrigatório.'] } });
        }
        const novoUsuario = await Usuario.create({ nome, email, senha, perfil });
        res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            perfil: novoUsuario.perfil
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Listar todos os usuários
router.get('/', async (req, res) => {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'nome', 'email'] });
    res.status(200).json(usuarios);
});

// Obter usuário por ID
router.get('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nome', 'email'] });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json(usuario);
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
    const { nome, email } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    try {
        await usuario.update({ nome, email });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao atualizar usuário', detalhes: err.message });
    }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    await usuario.destroy();
    res.status(204).send();
});

export default router;