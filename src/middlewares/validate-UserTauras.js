const { response, request } = require('express');
const { roleIsValid } = require('../helpers/db-Validators');


const validateDataUser = async (req = request, res = response, next) => {
  const { nombre, correo, password, rol } = req.body;

  // Validar nombre
  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        msg: 'El nombre es obligatorio y no puede estar vacío o solo espacios'
      });
    }
    req.body.nombre = nombre.trim();
  }

  // Validar correo
  if (correo !== undefined) {
    if (typeof correo !== 'string' || correo.trim() === '') {
      return res.status(400).json({
        msg: 'El correo es obligatorio y no puede estar vacío'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        msg: 'El formato del correo no es válido'
      });
    }

    req.body.correo = correo.trim();
  }

  // Validar password
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        msg: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
  }

  // Validar rol desde la BD
  if (rol !== undefined) {
    try {
      await roleIsValid(rol);
    } catch (error) {
      return res.status(400).json({
        msg: error.message
      });
    }
  }

  next();
};

module.exports = {
  validateDataUser
};
