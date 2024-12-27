class CampaniasRepository {
  async insertCampaniaTx(connection, { idUsuario, nombre, fechaHoraProgramacion }) {
    const sql = `
      INSERT INTO campania (idUsuario, nombre, fechaHoraProgramacion, estado)
      VALUES (?, ?, ?, 1)
    `;
    const [result] = await connection.execute(sql, [
      idUsuario,
      nombre,
      fechaHoraProgramacion,
    ]);
    return result.insertId;
  }

  async insertMensajesTx(connection, { idCampania, mensajes }) {
    if (!mensajes || mensajes.length === 0) {
      return [];
    }
    const sql = `
      INSERT INTO mensaje (idCampania, estadoEnvio, mensaje, estado)
      VALUES ?
    `;
    const values = mensajes.map((m) => [
      idCampania,
      m.estadoEnvio || 1,
      m.mensaje,
      1,
    ]);
    const [result] = await connection.query(sql, [values]);

    const firstInsertedId = result.insertId;
    const insertedCount = result.affectedRows;

    return mensajes.map((m, idx) => ({
      idMensaje: firstInsertedId + idx,
      mensaje: m.mensaje,
      estadoEnvio: m.estadoEnvio || 1,
    }));
  }
}

module.exports = CampaniasRepository;
