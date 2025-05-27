const cron = require('node-cron');
const { checkContractExpirations } = require('../helpers/reviewContracts');


// Ejecutar todos los días a las 8:00 AM
// cron.schedule('0 8 * * *', async () => {
//   console.log('Ejecutando revisión de contratos...');
//   await checkContractExpirations();
// });

// Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  console.log('Ejecutando revisión de contratos...');
  await checkContractExpirations();
});

