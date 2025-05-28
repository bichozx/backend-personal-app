const Role = require('../models/Role');

const User = require('../models/User');
const EmployeeTauras  = require('../models/EmployeeTauras')

const roleIsValid = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExists = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await User.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}
const emailEmployeeExists= async( correo = '' ) => {

    // Verificar si el correo existe
    const emailEmployee = await EmployeeTauras.findOne({ correo });
    if ( emailEmployee ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const idCardExists = async( cedula = '' ) => {

    // Verificar si el correo existe
    const existId = await EmployeeTauras.findOne({ cedula: Number(cedula) });
    if ( existId ) {
        throw new Error(`la cedula: ${ cedula }, ya está registrado`);
    }
}

const userExistsById = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await User.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Categorias
 */
// const existeCategoriaPorId = async( id ) => {

//     // Verificar si el correo existe
//     const existeCategoria = await Categoria.findById(id);
//     if ( !existeCategoria ) {
//         throw new Error(`El id no existe ${ id }`);
//     }
// }

/**
 * Productos
 */
// const existeProductoPorId = async( id ) => {

//     // Verificar si el correo existe
//     const existeProducto = await Producto.findById(id);
//     if ( !existeProducto ) {
//         throw new Error(`El id no existe ${ id }`);
//     }
// }


module.exports = {
    emailEmployeeExists,
    roleIsValid,
    emailExists,
    userExistsById,
    idCardExists
    
}

