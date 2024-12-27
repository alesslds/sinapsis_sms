/**
 * @file reportesController.test.js
 * Pruebas unitarias del controlador de Reportes, 
 * validando parámetros de consulta y manejo de errores.
 */

const { createReportesController } = require('../../src/controllers/reportesController');

describe('reportesController', () => {
  let mockReportesService;
  let reportesController;

  beforeEach(() => {
    // Mock del servicio de reportes
    mockReportesService = {
      obtenerReporteMensajes: jest.fn(),
    };
    reportesController = createReportesController(mockReportesService);
  });

  test('Debe retornar el reporte con status 200 y datos correctos', async () => {
    const event = {
      queryStringParameters: {
        mes: '12',
        anio: '2024',
        idCliente: '777',
      },
    };

    const mockResponse = {
      data: [
        { estadoEnvio: 1, totalMensajes: 10 },
        { estadoEnvio: 2, totalMensajes: 5 },
      ],
      metadata: {
        mes: 12,
        anio: 2024,
        idCliente: 777,
        totalRegistros: 15,
      },
    };

    mockReportesService.obtenerReporteMensajes.mockResolvedValue(mockResponse);

    // Act
    const result = await reportesController.listarMensajesActivos(event);

    // Assert
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);

    expect(body).toEqual(mockResponse);

    // Verificamos que se haya llamado con los parámetros parseados
    expect(mockReportesService.obtenerReporteMensajes).toHaveBeenCalledWith({
      mes: 12,
      anio: 2024,
      idCliente: 777,
    });
  });

  test('Debe retornar 400 si falta anio en la query', async () => {
    // Arrage: Falta "anio"
    const event = {
      queryStringParameters: {
        mes: '12',
      },
    };

    // Act
    const result = await reportesController.listarMensajesActivos(event);

    // Assert
    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);

    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message).toMatch(/anio/);
    // No se debe invocar el servicio
    expect(mockReportesService.obtenerReporteMensajes).not.toHaveBeenCalled();
  });

  test('Debe retornar 400 si el "mes" está fuera de rango (e.g. 13)', async () => {
    // mes: 13 no es válido por ser > 12
    const event = {
      queryStringParameters: {
        mes: '13',
        anio: '2024',
      },
    };

    const result = await reportesController.listarMensajesActivos(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message).toMatch(/mes/);
    expect(mockReportesService.obtenerReporteMensajes).not.toHaveBeenCalled();
  });

  test('Debe retornar 500 si el servicio lanza un error', async () => {
    const event = {
      queryStringParameters: {
        mes: '12',
        anio: '2024',
      },
    };
    mockReportesService.obtenerReporteMensajes.mockRejectedValue(new Error('DB Error'));

    const result = await reportesController.listarMensajesActivos(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.code).toBe('INTERNAL_SERVER_ERROR');
  });
});
