const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'clave_temporal';

// Middleware global: valida el token y adjunta el usuario al request
function verificarToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded; // { id, nombre, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

// Middleware específico: solo admin
function verificarAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
  }
  next();
}

// Middleware específico: solo empleado
function verificarEmpleado(req, res, next) {
  if (req.usuario.rol !== 'empleado') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo empleados' });
  }
  next();
}

// Middleware específico: solo vigilante
function verificarVigilante(req, res, next) {
  if (req.usuario.rol !== 'vigilante') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo vigilantes' });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarEmpleado,
  verificarVigilante
};

