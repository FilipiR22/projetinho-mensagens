import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ajuste o caminho conforme seu arquivo database.js
import Usuario from './usuario.js'; // Adicione a extensão .js
import Comentario from './comentario.js'; // Adicione a extensão .js

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
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

Mensagens.belongsTo(Usuario, { foreignKey: 'idusuario' });
Mensagens.hasMany(Comentario, { foreignKey: 'idmensagem' });

export default Mensagens;