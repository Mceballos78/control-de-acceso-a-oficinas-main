const express = require('express');
const router = express.Router();
const Bitacora = require('../models/Bitacora');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// ── GET /api/bitacora ── Obtener todos los registros (solo admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const registros = await Bitacora.findAll({ order: [['fecha', 'DESC']] });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/bitacora/:id ── Obtener un registro por ID
router.get('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const registro = await Bitacora.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/bitacora ── Crear registro manual (opcional, normalmente se crea automático)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const nuevoRegistro = await Bitacora.create({
      usuario: req.usuario.id,
      accion: req.body.accion,
      detalle: JSON.stringify(req.body.detalle || {}),
      fecha: new Date()
    });
    res.status(201).json(nuevoRegistro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE /api/bitacora/:id ── Eliminar registro
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const rowsDeleted = await Bitacora.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json({ mensaje: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
