const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');   // Sequelize model
const Bitacora = require('../models/Bitacora'); // Sequelize model
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// Crear usuario
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, apellidos, correo, password, telefono, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre_usuario: nombre,
      apellidos_usuario: apellidos,
      correo_usuario: correo,
      contraseña_usuario: hashedPassword,
      telefono_usuario: telefono,
      id_rol: rol,
      estado_usuario: true
    });

    await Bitacora.create({
      id_usuario: req.usuario.id, // tu tabla usa id_usuario
      accion_bitacora: 'crear usuario',
      detalle_bitacora: JSON.stringify({ correo: nuevoUsuario.correo_usuario })
    });

    res.json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar usuario
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, apellidos, correo, password, telefono, rol } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const datosActualizados = {
      nombre_usuario: nombre,
      apellidos_usuario: apellidos,
      correo_usuario: correo,
      telefono_usuario: telefono,
      id_rol: rol
    };
    if (hashedPassword) datosActualizados.contraseña_usuario = hashedPassword;

    const [rowsUpdated, [usuarioActualizado]] = await Usuario.update(datosActualizados, {
      where: { id_usuario: req.params.id },
      returning: true
    });

    await Bitacora.create({
      id_usuario: req.usuario.id,
      accion_bitacora: 'editar usuario',
      detalle_bitacora: JSON.stringify({ id: req.params.id })
    });

    res.json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    await Usuario.destroy({ where: { id_usuario: req.params.id } });

    await Bitacora.create({
      id_usuario: req.usuario.id,
      accion_bitacora: 'eliminar usuario',
      detalle_bitacora: JSON.stringify({ id: req.params.id })
    });

    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
