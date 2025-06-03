const path = require('path');
const generateDocx = require('./generateDocx');

const generateEmployeeDocuments = (empleado) => {
  const cedula = empleado.cedula;
  const basePath = path.resolve(__dirname, `../outputs/${cedula}`);

  const docs = [];

  // Contrato según tipo
  const contratoTemplate = empleado.tipoContrato === 'Indefinido'
    ? 'contracts/contrato_indefinido.docx'
    : 'contracts/contrato_fijo.docx';

  docs.push(generateDocx(contratoTemplate, empleado, `${basePath}/contrato.docx`));

  // Carta bienvenida
  docs.push(generateDocx('cartas/carta_bienvenida.docx', empleado, `${basePath}/carta_bienvenida.docx`));

  // Certificado laboral
  docs.push(generateDocx('certificados/certificado_laboral.docx', empleado, `${basePath}/certificado_laboral.docx`));

  return docs;
};

module.exports = generateEmployeeDocuments;
