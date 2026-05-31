const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Bitacora = require('../models/Bitacora');
const { verificarToken, verificarVigilante } = require('../middlewares/auth');

// Ver todas las citas (solo vigilante)
router.get('/', verificarToken, verificarVigilante, async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar nueva cita
router.post('/', verificarToken, verificarVigilante, async (req, res) => {
  try {
    const nuevaCita = await Cita.create(req.body);

    await Bitacora.create({
      usuario: req.usuario.id,
      accion: 'crear cita',
      detalle: JSON.stringify({ folio: nuevaCita.folio })
    });

    res.json(nuevaCita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Registrar entrada
router.post('/:folio/entrada', verificarToken, verificarVigilante, async (req, res) => {
  try {
    const cita = await Cita.findOne({ where: { folio: req.params.folio } });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

    cita.fechaHoraEntrada = new Date();
    await cita.save();

    await Bitacora.create({
      usuario: req.usuario.id,
      accion: 'entrada cita',
      detalle: JSON.stringify({ folio: req.params.folio })
    });

    res.json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Registrar salida
router.post('/:folio/salida', verificarToken, verificarVigilante, async (req, res) => {
  try {
    const cita = await Cita.findOne({ where: { folio: req.params.folio } });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

    cita.fechaHoraSalida = new Date();
    await cita.save();

    await Bitacora.create({
      usuario: req.usuario.id,
      accion: 'salida cita',
      detalle: JSON.stringify({ folio: req.params.folio })
    });

    res.json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
