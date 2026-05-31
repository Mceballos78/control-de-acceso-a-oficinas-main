const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre_usuario: { type: DataTypes.STRING, allowNull: false },
  apellidos_usuario: { type: DataTypes.STRING, allowNull: false },
  correo_usuario: { type: DataTypes.STRING, allowNull: false, unique: true },
  contraseña_usuario: { type: DataTypes.STRING, allowNull: false },
  telefono_usuario: { type: DataTypes.STRING },
  id_rol: { type: DataTypes.INTEGER, allowNull: false },
  estado_usuario: { type: DataTypes.INTEGER, defaultValue: 1 },
  fecha_creacion_usuario: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;
