const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bitacora = sequelize.define('Bitacora', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario: { type: DataTypes.INTEGER, allowNull: false },
  accion: { type: DataTypes.STRING, allowNull: false },
  detalle: { type: DataTypes.TEXT },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'bitacora',
  timestamps: false
});

module.exports = Bitacora;
