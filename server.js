const express = require('express');
const sequelize = require('./database');
const mensagensRouter = require('./routes/mensagens');
const usuarioRouter = require('./routes/usuario');
const erroMiddleware = require('./middlewares/erroMiddleware');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// app.use('/mensagens', mensagensRouter);
// app.use('/usuario', usuarioRouter);
app.use('/auth', authRoutes);

app.use(erroMiddleware);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});
