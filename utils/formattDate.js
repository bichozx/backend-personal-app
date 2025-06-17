const formattDate = (fecha) => {
  if (!fecha) return '';
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-CO', opciones);
};

module.exports={formattDate}