

const Employee = require('../models/EmployeeTauras'); // Asegúrate del nombre correcto del modelo
const { saveNotification } = require('../services/notificationServices');
// const { sendWhatsAppMessage } = require('../services/whatsappService');

const DAYS_BEFORE_ALERT = 1;

const checkContractExpirations = async () => {
  const now = new Date();
  console.log(`📅 Fecha actual: ${now.toISOString()}`);

  // Buscar empleados con contrato fijo
  const employees = await Employee.find({ tipoContrato: 'Fijo' });
  console.log(
    `🔍 Empleados con contrato Fijo encontrados: ${employees.length}`
  );

  for (const emp of employees) {
    let expirationDate = new Date(emp.createdAt);

    // Soporte para duración por días (útil en pruebas)
    if (emp.duracionContratoDias) {
      expirationDate.setDate(expirationDate.getDate() + emp.duracionContratoDias);
    } else {
      expirationDate.setMonth(expirationDate.getMonth() + emp.duracionContratoMeses);
    }

    const diffTime = expirationDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // const expirationDate = new Date(emp.createdAt);
    // expirationDate.setMonth(
    //   expirationDate.getMonth() + emp.duracionContratoMeses
    // );

    // const diffTime = expirationDate - now;
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(`👤 Empleado: ${emp.nombre} ${emp.apellido}`);
    console.log(`👤 EmpleadoId: ${emp._id}`);
    console.log(
      `📆 Fecha de creación del contrato: ${emp.createdAt.toISOString()}`
    );
    console.log(
      `📆 Fecha de vencimiento estimada: ${expirationDate.toISOString()}`
    );
    console.log(`⏳ Días restantes: ${diffDays}`);

    if (diffDays === DAYS_BEFORE_ALERT) {
      const message = `⚠️ El contrato de ${emp.nombre} ${emp.apellido} está próximo a vencer en ${diffDays} días.`;
      console.log(`✅ Notificación generada: ${message}`);

      // Guardar notificación
      await saveNotification({
        empleadoId: emp._id,
        nombre: emp.nombre,
        apellido: emp.apellido,
        mensaje: message,
        fecha: new Date(),
      });

      console.log(
        `💾 Notificación guardada para: ${emp.nombre} ${emp.apellido}`
      );

      // Enviar WhatsApp si lo deseas
      // await sendWhatsAppMessage(emp.celular, message);
    }
  }

  console.log('✅ Revisión de contratos completada.\n');
};

module.exports = {
  checkContractExpirations,
};
