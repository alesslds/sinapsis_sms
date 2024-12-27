const { createContainer } = require('./di/container');
const { createCampaniasController } = require('./controllers/campaniasController');
const { createReportesController } = require('./controllers/reportesController');

const {
  campaniasService,
  reportesService,
} = createContainer();

const campaniasController = createCampaniasController(campaniasService);
const reportesController = createReportesController(reportesService);

// Exportamos las funciones que serverless usará
module.exports.crearCampania = campaniasController.crearCampania;
module.exports.listarMensajesActivos = reportesController.listarMensajesActivos;
