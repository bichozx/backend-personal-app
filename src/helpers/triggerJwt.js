
const jwt = require('jsonwebtoken');

const triggerJWT = (uid = '', rol = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid, rol };              // 👈 incluye más info

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      { expiresIn: '4h' },
      (err, token) => {
        if (err) {
          console.log(err);
          return reject('No se pudo generar el token');
        }
        resolve(token);
      }
    );
  });
};

module.exports = { triggerJWT };

