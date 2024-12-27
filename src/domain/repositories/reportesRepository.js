const { getPool } = require('../../db');

class ReportesRepository {
  async findMensajesByMesAnioCliente({ mes, anio, idCliente }) {
    const pool = await getPool();

    let sql = `
      SELECT 
        CASE m.estadoEnvio
            WHEN 1 THEN 'Pendiente'
            WHEN 2 THEN 'Enviado'
            WHEN 3 THEN 'Error'
        END AS estadoEnvio,
        COUNT(*) AS totalMensajes
      FROM mensaje m
      INNER JOIN campania c ON m.idCampania = c.idCampania
      INNER JOIN usuario u ON c.idUsuario = u.idUsuario
      INNER JOIN cliente cl ON u.idCliente = cl.idCliente
      WHERE m.estado = 1
        AND c.estado = 1
        AND MONTH(m.fechaHoraEnvio) = ?
        AND YEAR(m.fechaHoraEnvio) = ?
    `;
    const params = [mes, anio];

    if (idCliente) {
      sql += ' AND cl.idCliente = ?';
      params.push(idCliente);
    }

    sql += ' GROUP BY m.estadoEnvio';

    const [rows] = await pool.execute(sql, params);
    return rows;
  }
}

module.exports = ReportesRepository;
