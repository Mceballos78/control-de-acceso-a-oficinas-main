const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Bitacora = require('../models/Bitacora');

// Middleware para verificar admin
function verificarAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
  }
  next();
}

// Crear usuario
router.post('/', verificarAdmin, async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    await Bitacora.create({
      usuario: req.usuario._id,
      accion: 'crear usuario',
      detalle: { email: nuevoUsuario.email }
    });

    res.json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar usuario
router.put('/:id', verificarAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await Bitacora.create({
      usuario: req.usuario._id,
      accion: 'editar usuario',
      detalle: { id: req.params.id }
    });

    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);

    await Bitacora.create({
      usuario: req.usuario._id,
      accion: 'eliminar usuario',
      detalle: { id: req.params.id }
    });

    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
