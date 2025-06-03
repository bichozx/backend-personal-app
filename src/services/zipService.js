const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Crea un .zip con todos los documentos de retiro de un empleado
 * @param {string} cedula - Cédula del empleado
 * @returns {string} Ruta del archivo zip generado
 */
const zipRetirementDocs = (cedula) => {
  const retiroDir = path.resolve(__dirname, `../outputs/${cedula}/retiro`);
  const zipPath = path.resolve(__dirname, `../outputs/${cedula}/retiro_${cedula}.zip`);

  if (!fs.existsSync(retiroDir)) {
    throw new Error('No se encontró la carpeta de retiro del empleado');
  }

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(zipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(retiroDir, false); // incluye todos los archivos del folder
    archive.finalize();
  });
};

const zipHiringDocs = (cedula) => {
  const carpetaEmpleado = path.resolve(__dirname, `../outputs/${cedula}`);
  const zipPath = path.resolve(carpetaEmpleado, `contratos_${cedula}.zip`);

  if (!fs.existsSync(carpetaEmpleado)) {
    throw new Error('Carpeta del empleado no encontrada');
  }

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(zipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    // 👉 Excluir carpeta 'retiro'
    fs.readdirSync(carpetaEmpleado).forEach((file) => {
      const fullPath = path.join(carpetaEmpleado, file);
      if (fs.statSync(fullPath).isFile()) {
        archive.file(fullPath, { name: file });
      }
    });

    archive.finalize();
  });
};

/**
 * Genera un .zip con todos los documentos de la carpeta /documents/descargables/
 * @returns {Promise<string>} Ruta del zip generado
 */
const zipDescargables = () => {
  const descargablesPath = path.resolve(__dirname, '../documents/descargables');
  const zipPath = path.resolve(__dirname, '../outputs/descargables.zip');

  if (!fs.existsSync(descargablesPath)) {
    throw new Error('La carpeta de descargables no existe');
  }

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(zipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(descargablesPath, false); // no incluye la carpeta, solo el contenido
    archive.finalize();
  });
}

module.exports = {
  zipRetirementDocs,
  zipHiringDocs,
  zipDescargables
};



