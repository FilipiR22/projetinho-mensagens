const express = require('express');
const sequelize = require('./database');
const mensagensRouter = require('./routes/mensagens');
const usuarioRouter = require('./routes/usuario');
const erroMiddleware = require('./middlewares/erroMiddleware');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Serve o frontend primeiro
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ⚙️ Depois disso, suas rotas de API
app.use('/mensagens', mensagensRouter);
app.use('/usuario', usuarioRouter);
app.use('/auth', authRoutes);

// 🚨 Depois disso, os middlewares de erro
app.use(erroMiddleware);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});
