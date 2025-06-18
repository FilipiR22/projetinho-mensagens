const Usuario = require('./usuario');
const Mensagens = require('./mensagens');

Usuario.hasMany(Mensagens, { foreignKey: 'usuarioId' });
Mensagens.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = { Usuario, Mensagens };