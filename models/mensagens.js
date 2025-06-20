const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./usuario');

const Mensagens = sequelize.define('Mensagens', { // Corrija aqui para plural
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
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

Mensagens.belongsTo(Usuario, { foreignKey: 'idusuario' });

module.exports = Mensagens;