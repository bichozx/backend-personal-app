

const { Schema, model, Types } = require('mongoose');

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
    required: [true, 'La cedula es obligatoria'],
    unique: true,
  },
  lugarDeExpedicion: {
    type: String,
    required: [true, 'La cedula es obligatoria'],
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
    required: [true, 'La direccion es obligatoria'],
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
    default: null,
  },
  estado: {
    type: Boolean,
    default: true,
  },

  eliminadoPor: {
    type: Types.ObjectId,        // Referencia al usuario que elimina
    ref: 'User',
    default: null,
  },
  fechaEliminacion: {
    type: Date,
    default: null,
  },
  descripcion:{
    type:String,
    default: null,
  },

  createdAt: {
  type: Date,
  required: true,
  default: () => new Date(),
},
});

// Para no enviar __v y renombrar _id a uid
EmployeeTaurasSchema.methods.toJSON = function () {
  const { __v, _id, ...employee } = this.toObject();
  employee.uid = _id;
  return employee;
};

module.exports = model('EmployeeTauras', EmployeeTaurasSchema);
