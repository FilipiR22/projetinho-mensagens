const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const models = require('../models');

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
}, {
    timestamps: false,
});
Mensagens.associate = (models) => {
    Mensagens.belongsTo(models.Usuario, {
        foreignKey: 'userId',
        as: 'user',
    });
};


module.exports = Mensagens;