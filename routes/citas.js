const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Bitacora = require('../models/Bitacora');

// Middleware para verificar vigilante
function verificarVigilante(req, res, next) {
  if (req.usuario.rol !== 'vigilante') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo vigilantes' });
  }
  next();
}

// Ver todas las citas
router.get('/', verificarVigilante, async (req, res) => {
  const citas = await Cita.find();
  res.json(citas);
});

// Registrar nueva cita
router.post('/', verificarVigilante, async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();

    await Bitacora.create({
      usuario: req.usuario._id,
      accion: 'crear cita',
      detalle: { folio: nuevaCita.folio }
    });

    res.json(nuevaCita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Registrar entrada
router.post('/:folio/entrada', verificarVigilante, async (req, res) => {
  const cita = await Cita.findOneAndUpdate(
    { folio: req.params.folio },
    { fechaHoraEntrada: new Date() },
    { new: true }
  );

  await Bitacora.create({
    usuario: req.usuario._id,
    accion: 'entrada cita',
    detalle: { folio: req.params.folio }
  });

  res.json(cita);
});

// Registrar salida
router.post('/:folio/salida', verificarVigilante, async (req, res) => {
  const cita = await Cita.findOneAndUpdate(
    { folio: req.params.folio },
    { fechaHoraSalida: new Date() },
    { new: true }
  );

  await Bitacora.create({
    usuario: req.usuario._id,
    accion: 'salida cita',
    detalle: { folio: req.params.folio }
  });

  res.json(cita);
});

module.exports = router;
