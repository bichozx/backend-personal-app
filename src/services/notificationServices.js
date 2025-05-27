// const Notification = require('../models/Notification');

// const saveNotification = async ({ empleadoId, mensaje, fecha }) => {
//   console.log(`📥 Guardando notificación para empleado ID: ${empleadoId}`);
//   const notificacion = new Notification({
//     empleadoId,
//     mensaje,
//     fecha
//   });
//   await notificacion.save();
//   console.log('✅ Notificación guardada correctamente');
// };

// module.exports = {
//   saveNotification
// };


const Notification = require('../models/Notification');

const saveNotification = async ({ empleadoId, nombre, apellido, mensaje, fecha }) => {
  console.log(`📥 Guardando notificación para: ${nombre} ${apellido} (ID: ${empleadoId})`);

  const notificacion = new Notification({
    empleadoId,
    nombre,
    apellido,
    mensaje,
    fecha
  });

  await notificacion.save();
  console.log('✅ Notificación guardada correctamente en MongoDB');
};

module.exports = {
  saveNotification
};
