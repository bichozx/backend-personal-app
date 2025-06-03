const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const generateDocx = (templateRelativePath, data, outputFilePath) => {
  const templatePath = path.resolve(__dirname, `../documents/${templateRelativePath}`);
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    data: { ...data },
  });

  try {
    doc.render();
  } catch (error) {
    throw new Error(`Error generando documento: ${error.message}`);
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, buffer);

  return outputFilePath;
};

module.exports = generateDocx;
