const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usertauras = require('../models/User');

const userTaurasPost = async (req, res = response) => {
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

// const userTaurasPut = async(req, res = response) => {

//     const { id } = req.params;
//     const { _id, password, google, correo, ...resto } = req.body;

//     if ( password ) {
//         // Encriptar la contraseña
//         const salt = bcryptjs.genSaltSync();
//         resto.password = bcryptjs.hashSync( password, salt );
//     }

//     const usuario = await Usuario.findByIdAndUpdate( id, resto );

//     res.json(usuario);
// }



const userTaurasDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const admin = req.userTauras; // viene del middleware validarJWT

  const user = await Usertauras.findByIdAndUpdate(
    id,
    {
      estado: false,
      eliminadoPor: admin._id,
      fechaEliminacion: new Date()
    },
    { new: true }
  );

  res.json({
    msg: 'Usuario desactivado correctamente',
    eliminadoPor: {
      id: admin._id,
      nombre: admin.nombre,
      correo: admin.correo
    },
    fechaEliminacion: user.fechaEliminacion,
    usuarioDesactivado: user
  });
};

module.exports = {
  userTaurasPost,
  userTaurasDelete,
};
