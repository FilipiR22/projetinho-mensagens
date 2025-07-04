import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Comentario = sequelize.define('Comentario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    conteudo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datahora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idmensagem: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default Comentario;