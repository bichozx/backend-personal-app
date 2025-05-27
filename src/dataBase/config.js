const mongoose = require('mongoose');

const dbConnectiion = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CNN, {
      
     
    });
    console.log('Base de datos en línea para proyectoTauras2');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    throw new Error('No se pudo establecer conexión con la base de datos');
  }
};


module.exports = { dbConnectiion };