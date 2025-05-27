const { Schema, model } = require('mongoose');

const EmployeeTaurasSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
  },
  cedula: {
    type: Number,
    required: [true, 'La cedula es obligatorio'],
    unique: true,
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  cargo: {
    type: String,
    required: [true, 'El cargo es obligatorio'],
  },
  celular: {
    type: String,
    required: [true, 'El numero de celular es obligatorio'],
  },
  direccion: {
    type: String,
    required: [true, 'La direccion es obligatorio'],
  },
  salario: {
    type: String,
    required: [true, 'El salario es obligatorio'],
  },
  tipoContrato: {
    type: String,
    required: true,
    enum: ['Indefinido', 'Fijo'],
    default: ' ',
  },
  duracionContratoMeses: {
    type: Number,
    required: function () {
      return this.tipoContrato === 'Fijo';
    },
  },
  duracionContratoDias: {
    type: Number,
    default: null, // Si no se usa, calcula en meses como siempre
  },

  estado: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EmployeeTaurasSchema.methods.toJSON = function () {
  const { __v, nombre, _id, ...EmployeeTaurasSchema } = this.toObject();
  EmployeeTaurasSchema.uid = _id;
  return EmployeeTaurasSchema;
};

module.exports = model('EmployeeTauras', EmployeeTaurasSchema);
