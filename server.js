const express = require('express');
const sequelize = require('./database');
const mensagemRoutes = require('./routes/mensagens');
const usuarioRoutes = require('./routes/usuario');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const comentariosRoutes = require('./routes/comentario');
const path = require('path');

// Importe os modelos
const Usuario = require('./models/usuario');
const Mensagens = require('./models/mensagens');
const Comentario = require('./models/comentario');

// Defina os relacionamentos aqui
Comentario.belongsTo(Usuario, { foreignKey: 'idusuario' });
Comentario.belongsTo(Mensagens, { foreignKey: 'idmensagem' });
Mensagens.hasMany(Comentario, { foreignKey: 'idmensagem' });
Usuario.hasMany(Comentario, { foreignKey: 'idusuario' });

const app = express();
app.use(express.json());

// Rotas de API (protegidas)
app.use('/mensagens', authMiddleware, mensagemRoutes);

// Rotas de comentários SEM proteção
app.use('/mensagens/:idmensagem/comentarios', authMiddleware, comentariosRoutes);

// Rotas públicas
app.use('/usuario', usuarioRoutes);
app.use('/login', authRoutes);

// Arquivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));

// Rotas para páginas HTML
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// app.get('/mensagens/:idmensagem/comentarios', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'comentarios.html'));
// });

const PORT = 3000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });
