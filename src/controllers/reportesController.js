const { validarReporteMensajes } = require('../validations/reportesValidation');
const { buildResponse, buildErrorResponse } = require('../utils/responseBuilder');


function createReportesController(reportesService) {
  return {
    listarMensajesActivos: async (event) => {
      try {
        const query = event.queryStringParameters || {};

        const { mes, anio, idCliente } = validarReporteMensajes({
          mes: query.mes ? parseInt(query.mes, 10) : undefined,
          anio: query.anio ? parseInt(query.anio, 10) : undefined,
          idCliente: query.idCliente ? parseInt(query.idCliente, 10) : undefined,
        });

        const reporte = await reportesService.obtenerReporteMensajes({ mes, anio, idCliente });

        return buildResponse(200, reporte);
      } catch (error) {
        console.error('[listarMensajesActivos] Error:', error.message);

        if (error.message && error.message.startsWith('Error de validación:')) {
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
  createReportesController,
};
