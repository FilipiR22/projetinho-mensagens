import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './meubanco.db',
    logging: false,
});

export default sequelize;