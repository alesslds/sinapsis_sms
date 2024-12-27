class ReportesService {
    /**
     * @param {ReportesRepository} reportesRepository
     */
    constructor(reportesRepository) {
      this.reportesRepository = reportesRepository;
    }
  
    async obtenerReporteMensajes({ mes, anio, idCliente }) {
      const rows = await this.reportesRepository.findMensajesByMesAnioCliente({
        mes,
        anio,
        idCliente,
      });
  
      const totalRegistros = rows.reduce((acc, row) => acc + row.totalMensajes, 0);
  
      return {
        data: rows.map((row) => ({
          estadoEnvio: row.estadoEnvio,
          totalMensajes: row.totalMensajes,
        })),
        metadata: {
          mes,
          anio,
          idCliente: idCliente || null,
          totalRegistros,
        },
      };
    }
  }
  
  module.exports = ReportesService;
  