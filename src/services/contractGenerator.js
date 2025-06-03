

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


