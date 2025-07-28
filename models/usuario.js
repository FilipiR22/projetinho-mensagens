import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ajuste o caminho se necessário
import bcrypt from 'bcrypt';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USER', // padrão USER
        validate: {
            isIn: [['ADMIN', 'USER']]
        }
    }
}, {
    timestamps: false
});

// Verifica a senha no login
Usuario.prototype.checkPassword = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

export default Usuario;