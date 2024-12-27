/**
 * @file campaniasController.test.js
 * Pruebas unitarias del controlador de Campanías,
 * verificando validaciones, respuestas y manejo de errores.
 */

const { createCampaniasController } = require('../../src/controllers/campaniasController');

describe('campaniasController', () => {
  let mockCampaniasService;
  let campaniasController;

  beforeEach(() => {
    // Creamos un mock del servicio
    mockCampaniasService = {
      crearCampaniaTx: jest.fn(),
    };
    // Inyectamos el mock al crear la instancia del controlador
    campaniasController = createCampaniasController(mockCampaniasService);
  });

  test('Debe crear la campaña correctamente y retornar status 201', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        idUsuario: 1,
        nombre: 'Mi Campaña',
        fechaHoraProgramacion: '2024-12-31T23:59:59Z',
        mensajes: [
          { mensaje: 'Hola mundo', estadoEnvio: 1 },
          { mensaje: 'Segundo mensaje' },
        ],
      }),
    };

    const mockResponse = {
      idCampania: 99,
      nombre: 'Mi Campaña',
      fechaHoraProgramacion: '2024-12-31T23:59:59Z',
      estado: 1,
      mensajesCreados: [
        { idMensaje: 100, mensaje: 'Hola mundo', estadoEnvio: 1 },
        { idMensaje: 101, mensaje: 'Segundo mensaje', estadoEnvio: 1 },
      ],
    };

    mockCampaniasService.crearCampaniaTx.mockResolvedValue(mockResponse);

    // Act
  const result = await campaniasController.crearCampania(event);

  // Assert
  expect(result.statusCode).toBe(201);
  expect(mockCampaniasService.crearCampaniaTx).toHaveBeenCalledTimes(1);

  const [[payload]] = mockCampaniasService.crearCampaniaTx.mock.calls;
  
  // Fix the payload assertions to match the actual input
  expect(payload).toEqual({
    idUsuario: 1, // This should match the input, not 99
    nombre: 'Mi Campaña',
    fechaHoraProgramacion: new Date('2024-12-31T23:59:59Z'),
    mensajes: [
      { mensaje: 'Hola mundo', estadoEnvio: 1 },
      { mensaje: 'Segundo mensaje' },
    ],
  });

  // Verify response body
  const body = JSON.parse(result.body);
  expect(body).toEqual(mockResponse);
  });

  test('Debe retornar error 400 si falla la validación (falta fechaHoraProgramacion)', async () => {
    const event = {
      body: JSON.stringify({
        idUsuario: 10,
        nombre: 'Campaña incompleta',
        // falta fechaHoraProgramacion
      }),
    };

    const result = await campaniasController.crearCampania(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);

    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message).toMatch(/fechaHoraProgramacion/);
    // Verificamos que no se llamó al servicio
    expect(mockCampaniasService.crearCampaniaTx).not.toHaveBeenCalled();
  });

  test('Debe retornar error 400 si se envía un mensaje muy largo (validación de 160 chars)', async () => {
    const longText = 'x'.repeat(161); // 161 caracteres
    const event = {
      body: JSON.stringify({
        nombre: 'Campaña con mensaje largo',
        fechaHoraProgramacion: '2025-01-01T12:00:00Z',
        mensajes: [
          { mensaje: longText },
        ],
      }),
    };

    const result = await campaniasController.crearCampania(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);

    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message).toMatch(/must be less than or equal to 160 characters/);
    expect(mockCampaniasService.crearCampaniaTx).not.toHaveBeenCalled();
  });

  test('Debe retornar error 500 si el servicio lanza un error inesperado', async () => {
    const event = {
      body: JSON.stringify({
        nombre: 'Campaña ok',
        fechaHoraProgramacion: '2024-12-31T23:59:59Z',
      }),
    };

    const mockError = new Error('DB connection lost');
    mockCampaniasService.crearCampaniaTx.mockRejectedValue(mockError);

    const result = await campaniasController.crearCampania(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.code).toBe('INTERNAL_SERVER_ERROR');
  });
});
