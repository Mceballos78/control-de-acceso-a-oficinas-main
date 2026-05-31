const express = require('express');
const router = express.Router();
const { verificarToken, verificarEmpleado } = require('../middlewares/auth');
const Bitacora = require('../models/Bitacora');
const Usuario = require('../models/Usuario');
const Cita = require('../models/Cita');

// 🔹 Perfil del empleado
router.get('/perfil', verificarToken, verificarEmpleado, async (req, res) => {
  try {
    const empleado = await Usuario.findByPk(req.usuario.id);
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json({
      id: empleado.id,
      nombre: empleado.nombre,
      email: empleado.email,
      rol: empleado.rol
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Actualizar datos del empleado
router.put('/perfil', verificarToken, verificarEmpleado, async (req, res) => {
  try {
    const [rowsUpdated, [empleadoActualizado]] = await Usuario.update(req.body, {
      where: { id: req.usuario.id },
      returning: true
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    await Bitacora.create({
      usuario: req.usuario.id,
      accion: 'actualizar perfil empleado',
      detalle: JSON.stringify({ email: empleadoActualizado.email })
    });

    res.json(empleadoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Consultar citas del empleado
router.get('/citas', verificarToken, verificarEmpleado, async (req, res) => {
  try {
    const citas = await Cita.findAll({ where: { empleado: req.usuario.id } });
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
