const express = require('express');
const router = express.Router();
const Acceso = require('../models/Acceso');
const { verificarToken } = require('../middlewares/auth');

// ── GET /api/accesos ── Obtener todos
router.get('/', verificarToken, async (req, res) => {
  try {
    const accesos = await Acceso.findAll();
    res.json(accesos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/accesos/:id ── Obtener uno
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const acceso = await Acceso.findByPk(req.params.id);
    if (!acceso) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(acceso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/accesos ── Crear
router.post('/', verificarToken, async (req, res) => {
  try {
    const nuevoAcceso = await Acceso.create({
      usuario: req.usuario.id,
      tipo: req.body.tipo, // 'entrada' o 'salida'
      fechaHora: new Date()
    });
    res.status(201).json(nuevoAcceso);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PUT /api/accesos/:id ── Actualizar
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const [rowsUpdated, [accesoActualizado]] = await Acceso.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (rowsUpdated === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(accesoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE /api/accesos/:id ── Eliminar
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const rowsDeleted = await Acceso.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json({ mensaje: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
