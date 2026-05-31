const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Acceso = sequelize.define('Acceso', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario: { type: DataTypes.INTEGER, allowNull: false },
  fechaHora: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  tipo: { type: DataTypes.ENUM('entrada', 'salida'), allowNull: false }
}, {
  tableName: 'accesos',
  timestamps: false
});

module.exports = Acceso;
