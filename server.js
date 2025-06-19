const express = require('express');
const sequelize = require('./database');
const mensagemRoutes = require('./routes/mensagens');
const usuarioRoutes = require('./routes/usuario');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const path = require('path'); // Adicione esta linha

const app = express();
app.use(express.json());

app.use('/mensagens', authMiddleware, mensagemRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', authRoutes);

app.use(express.static(path.join(__dirname, 'public'))); // Adicione esta linha

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });
