const { response, request } = require('express');

const EmployeeTauras = require('../models/EmployeeTauras')
const employeeTaurasPost = async (req = request, res = response) => {
  try {
    const {
      nombre,
      apellido,
      cedula,
      correo,
      cargo,
      celular,
      direccion,
      salario,
      tipoContrato,
      duracionContratoMeses
    } = req.body;

    const employeeTauras = new EmployeeTauras({
      nombre,
      apellido,
      cedula,
      correo,
      cargo,
      celular,
      direccion,
      salario,
      tipoContrato,
      duracionContratoMeses,
    });

    await employeeTauras.save();

    res.status(201).json({
      msg: 'Empleado registrado correctamente',
      employeeTauras,
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      msg: 'No se pudo registrar el empleado',
      error: error.message || error,
    });
  }
};



module.exports = {
  employeeTaurasPost
};