require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');

// Definimos el modelo Usuario según tu tabla
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

async function setup() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con MySQL');

    const password = await bcrypt.hash('Nexus2024', 10);

    const usuarios = [
      { nombre_usuario: 'Jesus Ramón', apellidos_usuario: 'Camarillo Núñez', correo_usuario: 'jcamarillo@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6671111111', id_rol: 1 },
      { nombre_usuario: 'Marco Gerardo', apellidos_usuario: 'Ceballos Valdez', correo_usuario: 'mceballos@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6672222222', id_rol: 2 },
      { nombre_usuario: 'Jesus Enrique', apellidos_usuario: 'Felix Olea', correo_usuario: 'jfelix@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6673333333', id_rol: 2 },
      { nombre_usuario: 'Claudia Guadalupe', apellidos_usuario: 'Romero', correo_usuario: 'cromero@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6674444444', id_rol: 3 },
      { nombre_usuario: 'Ignacio', apellidos_usuario: 'Sanz Hernandez', correo_usuario: 'isanz@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6675555555', id_rol: 4 },
      { nombre_usuario: 'José Luis', apellidos_usuario: 'Toscano Sosa', correo_usuario: 'jltoscano@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6676666666', id_rol: 2 },
      { nombre_usuario: 'Fidel', apellidos_usuario: 'Bojorquez Solis', correo_usuario: 'fbojorquez@nexusguard.com', contraseña_usuario: password, telefono_usuario: '6677777777', id_rol: 2 },
    ];

    await Usuario.bulkCreate(usuarios, { ignoreDuplicates: true });
    console.log('✅ Usuarios iniciales insertados en sistema_acceso.usuario');
    console.log('📧 Contraseña inicial para todos: Nexus2024');
  } catch (err) {
    console.error('❌ Error al registrar usuarios iniciales:', err);
  } finally {
    await sequelize.close();
  }
}

setup();
