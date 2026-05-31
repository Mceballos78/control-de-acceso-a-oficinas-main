const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Modelo Sequelize

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo_usuario: correo } });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Validar contraseña con bcrypt
    const valido = await bcrypt.compare(password, usuario.contraseña_usuario);
    if (!valido) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT con id y rol
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Responder con token y rol
    res.json({ token, rol: usuario.id_rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
