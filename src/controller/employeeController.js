const { response, request } = require('express');

const EmployeeTauras = require('../models/EmployeeTauras');
const generateContract = require('../services/contractGenerator');

// const employeeGetTauras = async (req = request, res = response) => {
//   const { limite = 5, desde = 0 } = req.query;
//   const query = { estado: true };

//   const [total, employeeTauras] = await Promise.all([
//     EmployeeTauras.countDocuments(query),
//     EmployeeTauras.find(query).skip(Number(desde)).limit(Number(limite)),
//   ]);

//   res.json({
//     total,
//     employeeTauras,
//   });
// };

// const employeeTaurasPost = async (req = request, res = response) => {
//   try {
//     const {
//       nombre,
//       apellido,
//       cedula,
//       correo,
//       cargo,
//       celular,
//       direccion,
//       salario,
//       tipoContrato,
//       duracionContratoMeses
//     } = req.body;

//     const employeeTauras = new EmployeeTauras({
//       nombre,
//       apellido,
//       cedula,
//       correo,
//       cargo,
//       celular,
//       direccion,
//       salario,
//       tipoContrato,
//       duracionContratoMeses,
//     });

//     await employeeTauras.save();

//     res.status(201).json({
//       msg: 'Empleado registrado correctamente',
//       employeeTauras,
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(400).json({
//       msg: 'No se pudo registrar el empleado',
//       error: error.message || error,
//     });
//   }
//};

const employeeGetTauras = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, employeeTauras] = await Promise.all([
    EmployeeTauras.countDocuments(query),
    EmployeeTauras.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    employeeTauras,
  });
};

const employeeTaurasPost = async (req = request, res = response) => {
  try {
    const {
      nombre,
      apellido,
      cedula,
      lugarDeExpedicion,
      correo,
      cargo,
      celular,
      direccion,
      salario,
      tipoContrato,
      createdAt,
      duracionContratoMeses,
    } = req.body;

    // Usa fecha actual si no viene una
    const fechaInicio = createdAt ? new Date(createdAt) : new Date();

    // Calcular fecha final
    const fechaFinal = new Date(fechaInicio);
    fechaFinal.setMonth(
      fechaFinal.getMonth() + (Number(duracionContratoMeses) || 2)
    );

    const employeeTauras = new EmployeeTauras({
      nombre,
      apellido,
      cedula,
      lugarDeExpedicion,
      correo,
      cargo,
      celular,
      direccion,
      salario,
      tipoContrato,
      createdAt: fechaInicio,
      duracionContratoMeses,
    });

    await employeeTauras.save();

    // Generar contrato automáticamente
    const contratoPath = generateContract({
      nombre,
      apellido,
      cedula,
      lugarDeExpedicion,
      correo,
      celular,
      cargo,
      direccion,
      salario,
      tipoContrato,
      fechaInicio: fechaInicio.toLocaleDateString('es-CO'),
      fechaFinal: fechaFinal.toLocaleDateString('es-CO'),
    });

    res.status(201).json({
      msg: 'Empleado creado y contrato generado',
      empleado: employeeTauras,
      contratoGenerado: contratoPath,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: 'No se pudo registrar el empleado',
      error: error.message,
    });
  }
};

const employeeTaurasPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { _id, nombre, apellido, cedula, ...resto } = req.body;

  const employeeTaurasUpdate = await EmployeeTauras.findByIdAndUpdate(
    id,
    resto,
    { new: true }
  );
  if (!employeeTaurasUpdate) {
    return res.status(404).json({
      msg: `No existe un empleado con el id ${id}`,
    });
  }

  res.json({
    msg: 'put Api',
    id,
    employeeTaurasUpdate,
  });
};

const deleteEmployeeTauras = async (req = request, res = response) => {
  const { id } = req.params;
  const admin = req.userTauras; // viene del middleware validarJWT

  const employee = await EmployeeTauras.findByIdAndUpdate(
    id,
    {
      estado: false,
      eliminadoPor: admin._id,
      fechaEliminacion: new Date(),
    },
    { new: true }
  );

  if (!employee) {
    return res.status(404).json({
      msg: `No existe un empleado con el id ${id}`,
    });
  }

  res.json({
    msg: 'Usuario desactivado correctamente',
    eliminadoPor: {
      id: admin._id,
      nombre: admin.nombre,
      correo: admin.correo,
    },
    fechaEliminacion: employee.fechaEliminacion,
    usuarioDesactivado: employee,
  });
};

module.exports = {
  employeeGetTauras,
  employeeTaurasPost,
  employeeTaurasPut,
  deleteEmployeeTauras,
};
