// const { Schema, model } = require('mongoose');

// const NotificationSchema = Schema({
//   empleadoId: {
//     type: Schema.Types.ObjectId,
//     ref: 'EmployeeTauras',
//     required: true
//   },
//   mensaje: {
//     type: String,
//     required: true
//   },
//   fecha: {
//     type: Date,
//     default: Date.now
//   },
//   leida: {
//     type: Boolean,
//     default: false
//   }
// });

// module.exports = model('Notification', NotificationSchema);

const { Schema, model } = require('mongoose');

const NotificationSchema = Schema({
  empleadoId: {
    type: Schema.Types.ObjectId,
    ref: 'EmployeeTauras',
    required: true
  },
  nombre: {
    type: String, // ← Añadido
  },
  apellido: {
    type: String, // ← Añadido
  },
  mensaje: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  leida: {
    type: Boolean,
    default: false
  }
});

module.exports = model('Notification', NotificationSchema);

