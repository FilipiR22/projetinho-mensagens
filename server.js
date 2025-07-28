import express from 'express';
import sequelize from './database.js';
import mensagemRoutes from './routes/mensagens.js';
import usuarioRoutes from './routes/usuario.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middlewares/authMiddleware.js';
import comentariosRoutes from './routes/comentario.js';

// Importe os modelos
import Usuario from './models/usuario.js';
import Mensagens from './models/mensagens.js';
import Comentario from './models/comentario.js';
import RefreshToken from './models/refreshToken.js';

// Defina os relacionamentos aqui
Comentario.belongsTo(Usuario, { foreignKey: 'idusuario' });
Comentario.belongsTo(Mensagens, { foreignKey: 'idmensagem' });
Mensagens.hasMany(Comentario, { foreignKey: 'idmensagem' });
Usuario.hasMany(Comentario, { foreignKey: 'idusuario' });

const app = express();
app.use(express.json());

// Rotas de API (protegidas)
app.use('/mensagens', authMiddleware, mensagemRoutes);

// Rotas de comentários
app.use('/mensagens/:idmensagem/comentarios', authMiddleware, comentariosRoutes);

// Rotas públicas
app.use('/usuario', usuarioRoutes);
app.use('/login', authRoutes);

// Arquivos estáticos (comentado)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// Rotas para páginas HTML (comentado)
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
