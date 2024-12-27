// src/di/container.js

const { getPool } = require('../db');

// Repositorios
const CampaniasRepository = require('../domain/repositories/campaniasRepository');
const ReportesRepository = require('../domain/repositories/reportesRepository');

// Servicios
const CampaniasService = require('../domain/services/campaniasService');
const ReportesService = require('../domain/services/reportesService');

/**
 * Retorna un objeto conteniendo las instancias de cada servicio y repositorio.
 * Esto nos facilita la inyección de dependencias.
 */
function createContainer() {
  // 1. Instanciamos el pool de conexiones
  const pool = getPool();

  // 2. Creamos instancias de los repositorios
  const campaniasRepository = new CampaniasRepository();
  const reportesRepository = new ReportesRepository();

  // 3. Creamos instancias de los servicios inyectando los repositorios y el pool
  const campaniasService = new CampaniasService(pool, campaniasRepository);
  const reportesService = new ReportesService(reportesRepository);

  // 4. Devolvemos un objeto con todo lo necesario
  return {
    campaniasService,
    reportesService,
  };
}

module.exports = {
  createContainer,
};
