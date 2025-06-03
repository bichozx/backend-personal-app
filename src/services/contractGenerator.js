// const fs = require('fs');
// const path = require('path');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');

// const generateContract = (data) => {
//   const templatePath = path.resolve(__dirname, '../documents/contracts/1.CONTRATO_LABORAL_FIJO_2_MESES.docx');
//   const content = fs.readFileSync(templatePath, 'binary');

//   const zip = new PizZip(content);
//   const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

//   doc.setData(data);

//   try {
//     doc.render();
//   } catch (error) {
//     throw new Error('Error al renderizar el documento Word');
//   }

//   const buffer = doc.getZip().generate({ type: 'nodebuffer' });

//   const outputFileName = `${data.cedula}_contrato.docx`;
//   const outputPath = path.resolve(__dirname, `../outputs/${outputFileName}`);
//   fs.writeFileSync(outputPath, buffer);

//   return outputPath;
// };

// module.exports = generateContract;

// const fs = require('fs');
// const path = require('path');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');

// const generateContract = (data, plantillaNombre = 'contrato_fijo.docx') => {
//   const templatePath = path.resolve(__dirname, `../documents/contracts/1.CONTRATO_LABORAL_FIJO_2_MESES.docx`);
//   const content = fs.readFileSync(templatePath, 'binary');

//   const zip = new PizZip(content);
// console.log(data)
//   // ✅ Nueva forma de pasar los datos: como opción al constructor
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
//     data:{...data}// <<=== aquí va el objeto con nombre, cargo, etc.
//   });

//   try {
//     doc.render();
//   } catch (error) {
//     throw new Error('Error al renderizar el documento Word');
//   }

//   const buffer = doc.getZip().generate({ type: 'nodebuffer' });

//   const outputFileName = `${data.cedula}_${plantillaNombre}`;
//   const outputPath = path.resolve(__dirname, `../outputs/${outputFileName}`);
//   fs.writeFileSync(outputPath, buffer);

//   return outputPath;
// };

// module.exports = generateContract;

// const fs = require('fs');
// const path = require('path');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');

// const generateDocx = (data, templateRelativePath, outputName) => {
//   const templatePath = path.resolve(__dirname, '../documents', templateRelativePath);
//   const content = fs.readFileSync(templatePath, 'binary');

//   const zip = new PizZip(content);
//   const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

//   doc.setData(data);

//   try {
//     doc.render();
//   } catch (error) {
//     throw new Error(`Error al renderizar ${templateRelativePath}: ${error.message}`);
//   }

//   const buffer = doc.getZip().generate({ type: 'nodebuffer' });
//   const outputPath = path.resolve(__dirname, '../outputs', outputName);
//   fs.writeFileSync(outputPath, buffer);

//   return outputPath;
// };

// module.exports = generateDocx;

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const generateDocx = (data, templateRelativePath, outputName, employeeFolderName) => {
  const templatePath = path.resolve(__dirname, '../documents', templateRelativePath);
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    throw new Error(`Error al renderizar ${templateRelativePath}: ${error.message}`);
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  // 👉 Crear carpeta por empleado (por cédula, por ejemplo)
  const employeeDir = path.resolve(__dirname, '../outputs', employeeFolderName);
  if (!fs.existsSync(employeeDir)) {
    fs.mkdirSync(employeeDir, { recursive: true });
  }

  const outputPath = path.resolve(employeeDir, outputName);
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
};

module.exports = generateDocx;


