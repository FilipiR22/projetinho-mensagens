import express from 'express';
import Comentario from '../models/comentario.js'; // Adicione a extensão .js para módulos locais
const router = express.Router({ mergeParams: true }); 

// Listar comentários de uma mensagem
router.get('/', async (req, res) => {
    try {
        const { idmensagem } = req.params;
        const comentarios = await Comentario.findAll({
            where: { idmensagem },
            order: [['datahora', 'ASC']]
        });
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// Criar novo comentário
router.post('/', async (req, res) => {
    try {
        const { idmensagem } = parseInt(req.params.idmensagem);
        const { conteudo } = req.body;
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

export default router;