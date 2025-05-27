const { response } = require('express');

const isAdminRole = (req = request, res = response, next) => {
  if (!req.userTauras) {
    console.log(userTauras)
    return res.status(500).json({
      msg: 'se quiere verificar el role - Rol sin validar el token primero',
    });
  }

  const { rol, nombre } = req.userTauras;
  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${nombre} no es un administrador - No puede realizar esta acción`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    //console.log(roles, req.user.rol);
    if (!req.userTauras) {
      return res.status(500).json({
        msg: 'se quiere verificar el role - Rol sin validar el token primero',
      });
    }

    if (!roles.includes(req.userTauras.rol)) {
      return res.status(401).json({
        msg: `Se requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};

