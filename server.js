const express = require('express');
const sequelize = require('./database');
const mensagensRouter = require('./routes/mensagens');
const usuarioRouter = require('./routes/usuario');
const erroMiddleware = require('./middlewares/erroMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/mensagens', mensagensRouter);
app.use('/usuario', usuarioRouter);
app.use('/auth', authRoutes);
app.use(erroMiddleware);

const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});