const Joi = require('joi');

const campaniaSchema = Joi.object({
  idUsuario: Joi.number().integer().optional(),
  nombre: Joi.string().max(200).required(),
  fechaHoraProgramacion: Joi.date().iso().required(),
  mensajes: Joi.array().items(
    Joi.object({
      mensaje: Joi.string().max(160).required(),
      estadoEnvio: Joi.number().integer().valid(1, 2, 3).optional()
    })
  ).optional()
});

/**
 * Valida los datos para crear una campaña.
 * Lanza error si no cumple las reglas.
 */
function validarCreacionCampania(payload) {
  const { error, value } = campaniaSchema.validate(payload, { abortEarly: false });
  if (error) {
    throw new Error(`Validación fallida: ${error.details.map(d => d.message).join(', ')}`);
  }
  return value;
}

module.exports = {
  validarCreacionCampania
};
