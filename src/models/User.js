const { Schema, model } = require('mongoose');

const UserTaurasSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  rol: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    emun: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  eliminadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'UserTauras', // referencia al usuario administrador
    default: null,
  },
  fechaEliminacion: {
    type: Date,
    default: null,
  },
});

UserTaurasSchema.methods.toJSON = function () {
  const { __v, password, _id, ...userTauras } = this.toObject();
  userTauras.uid = _id;
  return userTauras;
};

module.exports = model('UserTauras', UserTaurasSchema);
