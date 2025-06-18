const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Mensagens = sequelize.define('Mensagem', {
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
    usuarioId: { // Adicionado para relação
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});


module.exports = Mensagens;