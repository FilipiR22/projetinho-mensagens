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
}, {
    timestamps: false,
});

// Corrigir o nome da constante e do método associate
Mensagens.associate = (models) => {
    Mensagens.belongsTo(models.Usuario, {
        foreignKey: 'userId',
        as: 'user',
    });
};


module.exports = Mensagens;