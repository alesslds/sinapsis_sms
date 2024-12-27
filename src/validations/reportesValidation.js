const Joi = require('joi');

/**
 * Esquema de validación para el reporte de mensajes.
 * - 'mes' y 'anio' son obligatorios y deben ser enteros dentro de un rango específico.
 * - 'idCliente' es opcional.
 */
const reporteMensajesSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  anio: Joi.number().integer().min(2000).max(2100).required(),
  idCliente: Joi.number().integer().optional(),
});

/**
 * Función que valida los parámetros y lanza excepción si no cumplen el esquema.
 */
function validarReporteMensajes(params) {
  const { error, value } = reporteMensajesSchema.validate(params);
  if (error) {
    throw new Error(`Error de validación: ${error.message}`);
  }
  return value;
}

module.exports = {
  validarReporteMensajes,
};
