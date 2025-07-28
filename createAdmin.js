// import sequelize from './database.js';
// import Usuario from './models/usuario.js';
// import bcrypt from 'bcrypt';

// async function createAdmin() {
//     await sequelize.sync();
//     const senhaHash = await bcrypt.hash('admin123', 10);
//     await Usuario.create({
//         nome: 'Administrador',
//         email: 'admin@email.com',
//         senha: senhaHash,
//         perfil: 'ADMIN'
//     });
//     console.log('Usuário admin criado!');
//     process.exit();
// }

// createAdmin();