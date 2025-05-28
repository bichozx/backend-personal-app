const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usertauras = require('../models/User');

const userGetTauras = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, userTauras] = await Promise.all([
    Usertauras.countDocuments(query),
    Usertauras.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    userTauras,
  });
};

const userTaurasPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const userTauras = new Usertauras({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  userTauras.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await userTauras.save();

  res.json({
    userTauras,
  });
};

const userTaurasPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const userTaurasUpdate = await Usertauras.findByIdAndUpdate(id, resto);

  res.json({
    msg: 'put Api',
    id,
    userTaurasUpdate,
  });
};

const userTaurasDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const admin = req.userTauras; // viene del middleware validarJWT

  const user = await Usertauras.findByIdAndUpdate(
    id,
    {
      estado: false,
      eliminadoPor: admin._id,
      fechaEliminacion: new Date(),
    },
    { new: true }
  );

  res.json({
    msg: 'Usuario desactivado correctamente',
    eliminadoPor: {
      id: admin._id,
      nombre: admin.nombre,
      correo: admin.correo,
    },
    fechaEliminacion: user.fechaEliminacion,
    usuarioDesactivado: user,
  });
};

const userTaurasPatch = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, correo, nombre, ...resto } = req.body;

  if (!id) {
    return res.status(400).json({ msg: 'El ID es requerido' });
  }

  // Verificar si no se envió nada
  if (!password && !correo && !nombre && Object.keys(resto).length === 0) {
    return res.status(400).json({ msg: 'No hay datos para actualizar' });
  }

  // Validar nombre si viene
  if (nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res
        .status(400)
        .json({ msg: 'El nombre no puede estar vacío o solo con espacios' });
    }
    resto.nombre = nombre.trim();
  }

  // Validar correo si viene
  if (correo !== undefined) {
    if (typeof correo !== 'string' || correo.trim() === '') {
      return res.status(400).json({ msg: 'El correo no puede estar vacío' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res
        .status(400)
        .json({ msg: 'El formato del correo no es válido' });
    }
    resto.correo = correo.trim();
  }

  // Validar y encriptar password si viene
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const userActualizado = await Usertauras.findByIdAndUpdate(id, resto, {
      new: true,
    });

    if (!userActualizado) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({
      msg: 'Usuario actualizado parcialmente',
      userActualizado,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error del servidor',
      error: error.message,
    });
  }
};

module.exports = {
  userGetTauras,
  userTaurasPost,
  userTaurasDelete,
  userTaurasPut,
  userTaurasPatch,
};
