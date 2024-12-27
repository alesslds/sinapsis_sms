class CampaniasService {
    /**
     * @param {Promise<Pool>} pool - Función o promesa que retorna un pool de MySQL (o la conexión).
     * @param {CampaniasRepository} campaniasRepository - Instancia del repositorio.
     */
    constructor(pool, campaniasRepository) {
      this.pool = pool;
      this.campaniasRepository = campaniasRepository;
    }
  
    async crearCampaniaTx({ idUsuario, nombre, fechaHoraProgramacion, mensajes }) {
      // 1. Obtener la conexión del pool
      const dbPool = await this.pool; 
      const connection = await dbPool.getConnection();
  
      try {
        // 2. Iniciar transacción
        await connection.beginTransaction();
  
        // 3. Insertar campaña
        const idCampania = await this.campaniasRepository.insertCampaniaTx(connection, {
          idUsuario: idUsuario || null,
          nombre,
          fechaHoraProgramacion,
        });
  
        // 4. Insertar mensajes (si existen)
        let mensajesCreados = [];
        if (mensajes && mensajes.length > 0) {
          mensajesCreados = await this.campaniasRepository.insertMensajesTx(connection, {
            idCampania,
            mensajes,
          });
        }
  
        // 5. Commit
        await connection.commit();
  
        return {
          idCampania,
          nombre,
          fechaHoraProgramacion,
          estado: 1,
          mensajesCreados,
        };
      } catch (error) {
        // 6. Rollback
        await connection.rollback();
        throw error;
      } finally {
        // 7. Liberar conexión
        connection.release();
      }
    }
  }
  
  module.exports = CampaniasService;
  