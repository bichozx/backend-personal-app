const { response } = require('express');
const bcryptjs = require('bcryptjs');

const UserTauras = require('../models/User');

const { triggerJWT } = require('../helpers/triggerJwt');
const { googleVerify } = require('../helpers/googleVerify');

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const userTauras = await UserTauras.findOne({ correo });
    if (!userTauras) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      });
    }

    // SI el usuario está activo
    if (!userTauras.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false',
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, userTauras.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });
    }

    // Generar el JWT
    const token = await triggerJWT(userTauras.id, userTauras.rol);

    res.json({
      userTauras,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let userTauras = await UserTauras.findOne({ correo });

    if (!userTauras) {
      // Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
      };

      userTauras = new UserTauras(data);
      await userTauras.save();
    }

    // Si el usuario en DB
    if (!userTauras.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    // Generar el JWT
    const token = await triggerJWT(userTauras.id);

    res.json({
      userTauras,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'Token de Google no es válido',
    });
  }
};

const refreshToken = async (req, res = response) => {
  try {
    const user = req.userTauras;                    // viene del middleware
    const newToken = await triggerJWT(user._id, user.rol);

    return res.json({
      token: newToken,
      rol: user.rol,
      uid: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'No se pudo renovar el token' });
  }
};

module.exports = {
  login,
  googleSignin,
  refreshToken,
};
