const { response, request } = require('express');
const path = require('path');
const moment = require('moment');

const fs = require('fs');

const EmployeeTauras = require('../models/EmployeeTauras');

const conversor = require('conversor-numero-a-letras-es-ar');
const Conversor = conversor.conversorNumerosALetras;
const miConversor = new Conversor();

const generateDocx = require('../services/contractGenerator');
const generateRetirementDocs = require('../services/generateRetirementDocs');
const {
  zipRetirementDocs,
  zipHiringDocs,
  zipDescargables,
} = require('../services/zipService');
const { formattDate } = require('../../utils/formattDate');

const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

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

const getProximosARetiro = async (req = request, res = response) => {
  try {
    const hoy = moment().startOf('day');
    const dentroDe30Dias = moment().add(30, 'days').endOf('day');

    const empleados = await EmployeeTauras.find({
      estado: true,
      fechaEliminacion: {
        $gte: hoy.toDate(),
        $lte: dentroDe30Dias.toDate(),
      },
    });

    const proximos = empleados.map((emp) => {
      const fechaEliminacion = moment(emp.fechaEliminacion);
      const diasRestantes = fechaEliminacion.diff(hoy, 'days');

      return {
        ...emp.toObject(),
        diasRestantes,
      };
    });

    res.json({
      total: proximos.length,
      proximos,
    });
  } catch (error) {
    console.error('Error al obtener próximos a retiro:', error.message);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const employeeGetRetiredTauras = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: false };

  const [total, employeeTauras] = await Promise.all([
    EmployeeTauras.countDocuments(query),
    EmployeeTauras.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    employeeTauras,
  });
};

const employeeTaurasById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const employee = await EmployeeTauras.findById(id);

    if (!employee || !employee.estado) {
      return res
        .status(404)
        .json({ msg: 'Empleado no encontrado o desactivado' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error al buscar empleado por ID:', error);
    res
      .status(500)
      .json({ msg: 'Error al buscar el empleado', error: error.message });
  }
};

const downloadRetirementZip = (req, res = response) => {
  const { cedula } = req.params;

  const zipPath = path.resolve(
    __dirname,
    `../outputs/${cedula}/retiro_${cedula}.zip`
  );

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
      fechaEliminacion,
      descripcion,
      duracionContratoMeses,
    } = req.body;

    // 1. Convertimos fechas
    // const fechaInicio = createdAt ? new Date(createdAt) : new Date();
    const fechaInicio = createdAt
      ? moment(createdAt, 'YYYY-MM-DD').startOf('day').toDate()
      : moment().startOf('day').toDate();
    // const fechaFinal = new Date(fechaInicio);
    // fechaFinal.setMonth(
    //   fechaFinal.getMonth() + (Number(duracionContratoMeses) || 2)
    // );
     const fechaFin = fechaEliminacion
      ? moment(fechaEliminacion, 'YYYY-MM-DD').startOf('day').toDate()
      : null;

    // 2. Salario en letras
    const salarioNumero = parseInt(salario);
    const salarioTexto = miConversor.convertToText(salarioNumero || 0);

    // 3. Fecha de ingreso en letras
    const dia = fechaInicio.getDate().toString().padStart(2, '0');
    const mes = meses[fechaInicio.getMonth()];
    const año = fechaInicio.getFullYear();
    const diaEnLetras = miConversor.convertToText(Number(dia));

    const fechaIngresoTexto = `${diaEnLetras.toUpperCase()} (${dia}) días del mes de ${mes} de ${año}`;

    // const fechaInicioTexto = formattDate(fechaInicio);
    // const fechaFinalTexto = formattDate(fechaEliminacion);
    const fechaInicioTexto = formattDate(fechaInicio);
    const fechaFinalTexto = fechaFin ? formattDate(fechaFin) : '';

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
      salarioTexto,
      tipoContrato,
      duracionContratoMeses,
      createdAt: fechaInicio,
      fechaInicioTexto,
      fechaEliminacion: fechaFin,
      fechaFinalTexto,
      fechaInicio,
      // fechaFinal,
      fechaIngresoTexto,
      descripcion,
    };

    const newEmpleado = new EmployeeTauras({
      ...empleadoData,
      // createdAt: fechaInicio,
      // duracionContratoMeses,
    });

    await newEmpleado.save();

    // Documentos a generar
    const documentosGenerados = [];

    // 1. Contrato laboral según tipo de contrato
    // const contratoNombre =
    //   tipoContrato === 'Fijo'
    //     ? 'contracts/1.CONTRATO_LABORAL_FIJO_2_MESES.docx'
    //     : 'contracts/1.CONTRATO_LABORAL_indefinido.docx';
    let contratoNombre = '';

    if (tipoContrato === 'Indefinido') {
      contratoNombre = 'contracts/1.CONTRATO_LABORAL_indefinido.docx';
    } else if (tipoContrato === 'Fijo') {
      if (duracionContratoMeses === 2) {
        contratoNombre = 'contracts/1.CONTRATO_LABORAL_FIJO_2_MESES.docx';
      } else if (duracionContratoMeses === 4) {
        contratoNombre = 'contracts/1.CONTRATO_LABORAL_FIJO_4_MESES.docx';
      } else {
        contratoNombre = 'contracts/1.CONTRATO_LABORAL_FIJO_GENERIC.docx'; // fallback
      }
    }

    documentosGenerados.push(
      generateDocx(empleadoData, contratoNombre, 'contrato.docx', cedula)
    );

    // 2. Generar todos los documentos necesarios de anexos
    const anexos = [
      'anexos/1.CONTRATO_MANEJO _Y _CONFIANZA.docx',
      'anexos/1.CONTRATO_MANEJO_Y_CONFIANZA-TERMINO_FIJO.docx',
      'anexos/2.CLAUSULA_ADICIONAL_AL_CONTRATO.docx',
      'anexos/2.CLAUSULA_ADICIONAL_AL_CONTRATO.docx',
      'anexos/3.ACUERDO_DE_CONFIDENCIALIDAD.docx',
      'anexos/5.AVISO_DE_PRIVACIDAD_USO_FOTOGRAFIAS (2).docx',
      'anexos/9.FORMATO_INDUCCION_GH_RIT_VERSION_2_JULIO_2024.docx',
      'anexos/12.VERIFICACION_COBERTURA_EPS_Y_ACTUALIZACION_DE_DATOS_IPS.docx',
      'anexos/13.MANEJO_DE_MONEDA_EXTRANJERA.docx',
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
  try {
    const { id } = req.params;
    const { _id, nombre, apellido, cedula, salario, createdAt, ...resto } =
      req.body;

    // Generar salarioTexto si hay salario nuevo
    if (salario) {
      resto.salario = salario;
      resto.salarioTexto = miConversor.convertToText(Number(salario), {
        plural: 'pesos',
        singular: 'peso',
        centPlural: 'centavos',
        centSingular: 'centavo',
      });
    }

    // Generar fechaIngresoTexto si se recibe createdAt
    if (createdAt) {
      const fechaInicio = moment(createdAt, 'YYYY-MM-DD').toDate();
      const dia = fechaInicio.getDate().toString().padStart(2, '0');
      const mesNombre = meses[fechaInicio.getMonth()];
      const año = fechaInicio.getFullYear();
      const diaEnLetras = miConversor.convertToText(dia);
      

      resto.fechaIngresoTexto = `${diaEnLetras.toUpperCase()} (${dia}) días del mes de ${mesNombre} de ${año}`;
    }

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
      msg: 'Empleado actualizado',
      id,
      employeeTaurasUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar el empleado',
      error: error.message,
    });
  }
};

const deleteEmployeeTauras = async (req = request, res = response) => {
  const { id } = req.params;
  const admin = req.userTauras; // viene del middleware validarJWT

  const { descripcion, fechaEliminacion } = req.body;

    const fechaEliminacionParsed = fechaEliminacion
    ? moment(fechaEliminacion, 'YYYY-MM-DD').startOf('day').toDate()
    : new Date();

  const employee = await EmployeeTauras.findByIdAndUpdate(
    id,
    {
      estado: false,
      eliminadoPor: admin._id,
      fechaEliminacion: fechaEliminacionParsed,
      descripcion, // ← NUEVO
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
      return res
        .status(404)
        .json({ msg: 'No se encontró el archivo .zip de contratación' });
    }

    res.download(zipPath, `documentos_contratacion_${cedula}.zip`, (err) => {
      if (err) {
        console.error('Error al descargar:', err.message);
        res.status(500).json({ msg: 'Error al descargar el archivo' });
      }
    });
  } catch (error) {
    console.error('Error al generar ZIP de contratación:', error.message);
    res
      .status(500)
      .json({ msg: 'Error al generar el archivo ZIP', error: error.message });
  }
};

const downloadFormatosGenerales = async (req, res = response) => {
  try {
    const zipPath = await zipDescargables();

    if (!fs.existsSync(zipPath)) {
      return res
        .status(404)
        .json({ msg: 'No se encontró el archivo .zip de formatos' });
    }

    res.download(zipPath, 'formatos_descargables.zip', (err) => {
      if (err) {
        console.error('Error al descargar los formatos:', err.message);
        res.status(500).json({ msg: 'Error al descargar los archivos' });
      }
    });
  } catch (error) {
    console.error('Error al generar ZIP de formatos:', error.message);
    res
      .status(500)
      .json({ msg: 'Error al generar el archivo ZIP', error: error.message });
  }
};

module.exports = {
  employeeGetTauras,
  getProximosARetiro,
  employeeGetRetiredTauras,
  employeeTaurasById,
  employeeTaurasPost,
  employeeTaurasPut,
  deleteEmployeeTauras,
  downloadRetirementZip,
  downloadHiringZip,
  downloadFormatosGenerales,
};
