// middleware/errorHandler.js (ou o nome do seu arquivo)
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // opcional: log para debug
    const status = err.status || 500;
    res.status(status).json({ erro: err.message || 'Erro interno do servidor' });
};

export default errorHandler;