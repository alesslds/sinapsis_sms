const { validarCreacionCampania } = require('../validations/campaniasValidation');
const { buildResponse, buildErrorResponse } = require('../utils/responseBuilder');

function createCampaniasController(campaniasService) {
  return {
    crearCampania: async (event) => {
      try {
        const body = JSON.parse(event.body || '{}');
        const payload = validarCreacionCampania(body);

        const campaniaCreada = await campaniasService.crearCampaniaTx(payload);

        return buildResponse(201, campaniaCreada);
      } catch (error) {
        console.error('[crearCampania] Error:', error);

        if (error.message && error.message.startsWith('Validación fallida:')) {
          return buildErrorResponse(400, {
            message: error.message,
            code: 'VALIDATION_ERROR',
          });
        }
        return buildErrorResponse(500, {
          message: 'Error interno del servidor',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  };
}

module.exports = {
  createCampaniasController,
};
