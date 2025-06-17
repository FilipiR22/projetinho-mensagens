const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Mensagens = sequelize.define('Mensagens', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    conteudo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: { // Adiciona a chave estrangeira
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Mensagens;