const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const UserTauras = require('../models/User');


const validateJwt= async( req = request, res = response, next ) => {

    const token = req.header('x-token');
    console.log('Token recibido:', token);

    if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Extrae solo el token
    }
  }

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const userTauras = await UserTauras.findById( uid );

        if( !userTauras ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
console.log(userTauras)
        // Verificar si el uid tiene estado true
        if ( !userTauras.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        
        
        req.userTauras = userTauras;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validateJwt
}