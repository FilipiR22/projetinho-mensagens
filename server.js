const express = require('express');
const sequelize = require('./database');
const mensagensRouter = require('./routes/Mensagem');
const usuarioRouter = require('./routes/Usuario');
const erroMiddleware = require('./middlewares/erroMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/mensagens', mensagensRouter);
app.use('/usuario', usuarioRouter);
app.use(erroMiddleware);


sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});