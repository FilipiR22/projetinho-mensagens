const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

// Método de instância para checar a senha
Usuario.prototype.checkPassword = function (senhaInformada) {
    // Para produção, use hash (bcrypt). Aqui é comparação simples.
    return this.senha === senhaInformada;
};

module.exports = Usuario;