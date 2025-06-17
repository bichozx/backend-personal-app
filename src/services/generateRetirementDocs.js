const path = require('path');
const generateDocx = require('./contractGenerator');
const { formattDate } = require('../../utils/formattDate');


const generateRetirementDocs = (empleado) => {
  const carpetaEmpleado = path.join(empleado.cedula.toString(), 'retiro');

  // const data = {
  //   nombre: empleado.nombre,
  //   apellido: empleado.apellido,
  //   cedula: empleado.cedula,
  //   cargo: empleado.cargo,
  //   correo: empleado.correo,
  //   fechaInicio: new Date(empleado.createdAt ?? new Date()).toLocaleDateString('es-CO'),
  //   fechaEliminacion: new Date().toLocaleDateString('es-CO'),
  //   salario: empleado.salario,
  // };
  const data = {
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  cedula: empleado.cedula,
  cargo: empleado.cargo,
  correo: empleado.correo,
  fechaInicioTexto: formattDate(empleado.createdAt ?? new Date()),
  fechaEliminacionTexto: formattDate(new Date()),
  salario: empleado.salario,
};


  const docsRetiro = [
    'retiro/1FORMATO_CARTA_ACEPTACION_DE_RENUNCIA_JUNIO_2024.docx',
    'retiro/2FORMATO_CARTA_REMISION_A_EXAMENES_DE_RETIRO_JUNIO_2024.docx',
    'retiro/3FORMATO_DE_PA_Y_SALVO_JUNIO_2024.docx',
    'retiro/4FORMATO_CERTIFICADO_LABORAL_RETIRO_JUNIO_2024.docx',
    'retiro/5FORMATO_CARTA_RETIRO_DE_CESANTIAS_JUNIO_2024.docx',
  ];

  const generados = [];

  docsRetiro.forEach((docPath) => {
    const nombreSalida = path.basename(docPath);
    const output = generateDocx(data, docPath, nombreSalida, carpetaEmpleado);
    generados.push(output);
  });

  return generados;
};

module.exports = generateRetirementDocs;
