require('dotenv').config();
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

const Usuario  = require('../models/Usuario'); // Sequelize model
const SECRET   = process.env.JWT_SECRET || 'clave_temporal';

// Códigos temporales en memoria
const codigosTemporal = {};

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/verificar-correo ──
router.post('/verificar-correo', async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }

    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    codigosTemporal[email] = codigo;

    console.log('Código de recuperación generado correctamente');
    res.json({ codigo, mensaje: 'Código generado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/cambiar-password ──
router.post('/cambiar-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.password = await bcrypt.hash(password, 10);
    await usuario.save();

    delete codigosTemporal[email];
    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
