const { response, request } = require('express');
const path = require('path');

const fs = require('fs');

const EmployeeTauras = require('../models/EmployeeTauras');
const generateContract = require('../services/contractGenerator');
const generateDocx = require('../services/contractGenerator');
const generateRetirementDocs = require('../services/generateRetirementDocs');
const {zipRetirementDocs, zipHiringDocs, zipDescargables} = require('../services/zipService');

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

const downloadRetirementZip = (req, res = response) => {
  const { cedula } = req.params;

  const zipPath = path.resolve(__dirname, `../outputs/${cedula}/retiro_${cedula}.zip`);

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({
      msg: 'Archivo ZIP no encontrado. Asegúrate de que se haya generado al eliminar el empleado.',
    });
  }

  res.download(zipPath, `documentos_retiro_${cedula}.zip`, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err.message);
      res.status(500).json({ msg: 'Error al descargar el archivo' });
    }
  });
};

// const employeeTaurasPost = async (req = request, res = response) => {
//   try {
//     const {
//       nombre,
//       apellido,
//       cedula,
//       lugarDeExpedicion,
//       correo,
//       cargo,
//       celular,
//       direccion,
//       salario,
//       tipoContrato,
//       createdAt,
//       duracionContratoMeses,
//     } = req.body;

//     // Usa fecha actual si no viene una
//     const fechaInicio = createdAt ? new Date(createdAt) : new Date();

//     // Calcular fecha final
//     const fechaFinal = new Date(fechaInicio);
//     fechaFinal.setMonth(
//       fechaFinal.getMonth() + (Number(duracionContratoMeses) || 2)
//     );

//     const employeeTauras = new EmployeeTauras({
//       nombre,
//       apellido,
//       cedula,
//       lugarDeExpedicion,
//       correo,
//       cargo,
//       celular,
//       direccion,
//       salario,
//       tipoContrato,
//       createdAt: fechaInicio,
//       duracionContratoMeses,
//     });

//     await employeeTauras.save();

//     // Generar contrato automáticamente
//     const contratoPath = generateContract({
//       nombre,
//       apellido,
//       cedula,
//       lugarDeExpedicion,
//       correo,
//       celular,
//       cargo,
//       direccion,
//       salario,
//       tipoContrato,
//       fechaInicio: fechaInicio.toLocaleDateString('es-CO'),
//       fechaFinal: fechaFinal.toLocaleDateString('es-CO'),
//     });

//     res.status(201).json({
//       msg: 'Empleado creado y contrato generado',
//       empleado: employeeTauras,
//       contratoGenerado: contratoPath,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       msg: 'No se pudo registrar el empleado',
//       error: error.message,
//     });
//   }
// };

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

    const fechaInicio = createdAt ? new Date(createdAt) : new Date();
    const fechaFinal = new Date(fechaInicio);
    fechaFinal.setMonth(
      fechaFinal.getMonth() + (Number(duracionContratoMeses) || 2)
    );

    const empleadoData = {
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
      fechaInicio: fechaInicio.toLocaleDateString('es-CO'),
      fechaFinal: fechaFinal.toLocaleDateString('es-CO'),
    };

    const newEmpleado = new EmployeeTauras({
      ...empleadoData,
      createdAt: fechaInicio,
      duracionContratoMeses,
    });

    await newEmpleado.save();

    // Documentos a generar
    const documentosGenerados = [];

    // 1. Contrato laboral según tipo de contrato
    const contratoNombre =
      tipoContrato === 'Fijo'
        ? 'contracts/1.CONTRATO_LABORAL_FIJO_2_MESES.docx'
        : 'contracts/1.CONTRATO_LABORAL_indefinido.docx';

    documentosGenerados.push(
      generateDocx(empleadoData, contratoNombre, 'contrato.docx', cedula)
    );

    // 2. Generar todos los documentos necesarios de anexos
    const anexos = [
      'anexos/3.ACUERDO_DE_CONFIDENCIALIDAD.docx',
      'anexos/2.CLAUSULA_ADICIONAL_AL_CONTRATO.docx',
      'anexos/5.AVISO_DE_PRIVACIDAD_USO_FOTOGRAFIAS (2).docx',
    ];

    anexos.forEach((file) => {
      const output = path.basename(file);
      documentosGenerados.push(
        generateDocx(empleadoData, file, output, cedula)
      );
    });

    res.status(201).json({
      msg: 'Empleado creado y documentos generados',
      empleado: newEmpleado,
      documentos: documentosGenerados,
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

   // ✅ Generar documentos de retiro
  const docsRetiro = generateRetirementDocs(employee);

   // ✅ Comprimir en ZIP
  let zipPath = '';
  try {
    zipPath = await zipRetirementDocs(employee.cedula.toString());
  } catch (error) {
    console.error('Error al generar el ZIP:', error.message);
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
    documentosRetiro: docsRetiro,
    zipRetiro: zipPath,
  });
};

const downloadHiringZip = async (req, res = response) => {
  const { cedula } = req.params;

  try {
    const zipPath = await zipHiringDocs(cedula);

    if (!fs.existsSync(zipPath)) {
      return res.status(404).json({ msg: 'No se encontró el archivo .zip de contratación' });
    }

    res.download(zipPath, `documentos_contratacion_${cedula}.zip`, (err) => {
      if (err) {
        console.error('Error al descargar:', err.message);
        res.status(500).json({ msg: 'Error al descargar el archivo' });
      }
    });

  } catch (error) {
    console.error('Error al generar ZIP de contratación:', error.message);
    res.status(500).json({ msg: 'Error al generar el archivo ZIP', error: error.message });
  }
};

const downloadFormatosGenerales = async (req, res = response) => {
  try {
    const zipPath = await zipDescargables();

    if (!fs.existsSync(zipPath)) {
      return res.status(404).json({ msg: 'No se encontró el archivo .zip de formatos' });
    }

    res.download(zipPath, 'formatos_descargables.zip', (err) => {
      if (err) {
        console.error('Error al descargar los formatos:', err.message);
        res.status(500).json({ msg: 'Error al descargar los archivos' });
      }
    });

  } catch (error) {
    console.error('Error al generar ZIP de formatos:', error.message);
    res.status(500).json({ msg: 'Error al generar el archivo ZIP', error: error.message });
  }
};

module.exports = {
  employeeGetTauras,
  employeeTaurasPost,
  employeeTaurasPut,
  deleteEmployeeTauras,
  downloadRetirementZip,
  downloadHiringZip,
  downloadFormatosGenerales
};
