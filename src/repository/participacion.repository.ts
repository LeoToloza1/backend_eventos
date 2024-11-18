import Conectar from "../db/config_db";
class RepoParticipacion implements IMapeo<IParticipacion> {
  constructor(private readonly db: Conectar) {}

  async obtenerTodos(): Promise<IParticipacion[]> {
    try {
      const sql = `
      SELECT 
        p.id, p.confirmacion, p.asistencia_real, 
        a.id AS asistente_id, a.nombre AS asistente_nombre, 
        a.apellido AS asistente_apellido, a.email AS asistente_email,
        a.telefono AS asistente_telefono, a.dni AS asistente_dni, 
        e.id AS evento_id, e.nombre AS evento_nombre,
        e.ubicacion AS evento_ubicacion, e.fecha AS evento_fecha,
        e.descripcion AS evento_descripcion, e.realizado AS evento_realizado
      FROM participacion p
      JOIN asistentes a ON p.asistente_id = a.id
      JOIN eventos e ON p.evento_id = e.id
    `;
      const resultados = await this.db.consultar(sql);
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los participaciones:", error);
      throw new Error("Error al obtener todos los participaciones");
    }
  }
  async buscarPorId(id: number): Promise<IParticipacion | null> {
    try {
      const sql = `SELECT 
        p.id, p.confirmacion, p.asistencia_real, 
        a.id AS asistente_id, a.nombre AS asistente_nombre, 
        a.apellido AS asistente_apellido, a.email AS asistente_email,
        a.telefono AS asistente_telefono, a.dni AS asistente_dni, 
        e.id AS evento_id, e.nombre AS evento_nombre,
        e.ubicacion AS evento_ubicacion, e.fecha AS evento_fecha,
        e.descripcion AS evento_descripcion, e.realizado AS evento_realizado
      FROM participacion p
      JOIN asistentes a ON p.asistente_id = a.id
      JOIN eventos e ON p.evento_id = e.id WHERE p.id = ?`;
      const resultados = await this.db.consultar(sql, [id]);
      if (resultados.length === 0) {
        return null;
      }
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al buscar el evento con id ${id}:`, error);
      throw new Error("Error al buscar por id un evento");
    }
  }

  async crear(
    item: IParticipacion,
    asistente: number
  ): Promise<IParticipacion | null> {
    try {
      const sql =
        "INSERT INTO participacion (asistente_id, evento_id, confirmacion) VALUES (?, ?, 1)";
      const { evento_id } = item;
      await this.db.consultar(sql, [asistente, evento_id]);
      return item;
    } catch (error) {
      console.error("Error al crear participacion:", error);
      return null;
    }
  }

  async actualizar(
    id: number,
    item: IParticipacion
  ): Promise<boolean | IParticipacion> {
    try {
      const campos = Object.keys(item)
        .filter((key) => item[key as keyof IParticipacion] !== undefined)
        .map((key) => `${key} = ?`);
      const valores = Object.values(item).filter(
        (valor) => valor !== undefined
      );

      if (campos.length === 0) {
        throw new Error("No hay campos para actualizar");
      }
      const sql = `UPDATE participacion SET ${campos.join(", ")} WHERE id = ?`;
      await this.db.consultar(sql, [...valores, id]);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el evento con id ${id}:`, error);
      return false;
    }
  }

  /**
   * Marca una participacion como realizada en la base de datos
   *
   * @param {number} id - El id de la participacion a marcar como realizada.
   * @returns {Promise<boolean>} - true si se marca como realizada correctamente,
   *                              false si ocurre un error.
   * @throws {Error} - Si ocurre un error al marcar la participacion como realizada.
   */
  async asistenciaReal(id: number): Promise<boolean> {
    try {
      const sql = "UPDATE participacion SET asistencia_real = ? WHERE id = ?";
      const asistenciaReal = true;
      await this.db.consultar(sql, [asistenciaReal, id]);
      return true;
    } catch (error) {
      console.error(
        `Error al actualizar la participación con id ${id}:`,
        error
      );
      return false;
    }
  }

  /**
   * Confirma la asistencia de un asistente en una participacion en la base de datos.
   *
   * @param {number} id - El id del asistente que se va a confirmar.
   * @returns {Promise<boolean>} - true si se confirma correctamente,
   *                              false si ocurre un error.
   * @throws {Error} - Si ocurre un error al confirmar la asistencia del
   *                  asistente con el id especificado.
   */
  async confirmarAsistencia(id: number): Promise<boolean> {
    try {
      const sql =
        "UPDATE participacion SET confirmacion = ? WHERE asistente_id = ?";
      const confirmacion = true;
      await this.db.consultar(sql, [confirmacion, id]);
      return true;
    } catch (error) {
      console.error(
        `Error al confirmar la asistencia del asistente: ${id}:`,
        error
      );
      return false;
    }
  }

  /**
   * Busca las participaciones de un evento por su nombre.
   *
   * @param {string} evento - El nombre del evento a buscar.
   * @returns {Promise<IParticipacion[]>} - Un array de objetos IParticipacion
   *                                       con los resultados de la consulta.
   * @throws {Error} - Si ocurre un error al buscar las participaciones del
   *                   evento.
   */
  async buscarPorEvento(evento: string): Promise<IParticipacion[]> {
    try {
      const sql = `SELECT p.id, 
                   p.confirmacion, 
                   p.asistencia_real, 
                   a.id AS asistente_id, 
                   a.nombre AS asistente_nombre, 
                   a.apellido AS asistente_apellido, 
                   a.email AS asistente_email, 
                   a.telefono AS asistente_telefono, 
                   a.dni AS asistente_dni, 
                   e.id AS evento_id, 
                   e.nombre AS evento_nombre, 
                   e.ubicacion AS evento_ubicacion, 
                   e.fecha AS evento_fecha, 
                   e.descripcion AS evento_descripcion, 
                   e.realizado AS evento_realizado
                FROM participacion p
                JOIN eventos e ON p.evento_id = e.id
                JOIN asistentes a ON p.asistente_id = a.id
                WHERE e.nombre LIKE ?;`;

      const resultados = await this.db.consultar(sql, [`${evento}%`]);
      if (resultados.length === 0) {
        throw new Error("No se encontraron resultados");
      }
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al buscar por evento:", error);
      throw new Error("Error al buscar por evento");
    }
  }

  /**
   * Busca las participaciones de un asistente por su id.
   *
   * @param {number} id - El id del asistente a buscar.
   * @returns {Promise<IParticipacion[]>} - Un array de objetos IParticipacion
   *                                       con los resultados de la consulta.
   * @throws {Error} - Si ocurre un error al buscar las participaciones del
   *                  asistente.
   */
  async obtenerPorAsistente(id: number) {
    try {
      const sql = `SELECT p.id, 
                 p.confirmacion, 
                 p.asistencia_real, 
                 a.id AS asistente_id, 
                 a.nombre AS asistente_nombre, 
                 a.apellido AS asistente_apellido, 
                 a.email AS asistente_email, 
                 a.telefono AS asistente_telefono, 
                 a.dni AS asistente_dni, 
                 e.id AS evento_id, 
                 e.nombre AS evento_nombre, 
                 e.ubicacion AS evento_ubicacion, 
                 e.fecha AS evento_fecha, 
                 e.descripcion AS evento_descripcion, 
                 e.realizado AS evento_realizado
              FROM participacion p
              JOIN eventos e ON p.evento_id = e.id
              JOIN asistentes a ON p.asistente_id = a.id
              WHERE p.asistente_id = ?;`;
      const resultados = await this.db.consultar(sql, [id]);
      if (resultados.length === 0) {
        return [];
      }
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al buscar por asistente:", error);
      throw new Error("Error al buscar por asistente");
    }
  }

  /**
   * Obtiene los eventos no confirmados por un asistente específico.
   *
   * @param {number} id - El id del asistente para verificar sus eventos no confirmados.
   * @returns {Promise<IEventos[]>} - Una lista de objetos IParticipacion que representan los eventos
   *                                        no confirmados por el asistente especificado.
   * @throws {Error} - Si ocurre un error al buscar eventos sin confirmar.
   */

  async eventosSinCnfirmar(id: number): Promise<IEventos[]> {
    try {
      const sql = `SELECT 
    e.id AS evento_id, 
    e.nombre AS evento_nombre, 
    e.ubicacion AS evento_ubicacion, 
    e.fecha AS evento_fecha, 
    e.descripcion AS evento_descripcion, 
    e.realizado AS evento_realizado
      FROM 
          eventos e
      LEFT JOIN 
          participacion p ON e.id = p.evento_id AND p.asistente_id = ?
      WHERE 
          e.realizado = 0 AND p.id IS NULL;`;
      const resultados = await this.db.consultar(sql, [id]);

      return this.mapearEventos(resultados);
    } catch (error) {
      console.error("Error al buscar eventos sin confirmar:", error);
      throw new Error("Error al buscar eventos sin confirmar");
    }
  }

  /**
   * Busca los asistentes de un evento específico por su id.
   *
   * @param {number} eventoId - El id del evento para buscar sus asistentes.
   * @returns {Promise<IParticipacion[]>} - Un array de objetos IParticipacion con los asistentes del evento.
   * @throws {Error} - Si ocurre un error al buscar los asistentes del evento.
   */
  async obtenerAsistentesPorEvento(
    eventoId: number
  ): Promise<IParticipacion[]> {
    try {
      const sql = `
      SELECT 
        p.id, 
        p.confirmacion, 
        p.asistencia_real, 
        a.id AS asistente_id, 
        a.nombre AS asistente_nombre, 
        a.apellido AS asistente_apellido, 
        a.email AS asistente_email,
        a.telefono AS asistente_telefono, 
        a.dni AS asistente_dni, 
        e.id AS evento_id, 
        e.nombre AS evento_nombre, 
        e.ubicacion AS evento_ubicacion, 
        e.fecha AS evento_fecha, 
        e.descripcion AS evento_descripcion, 
        e.realizado AS evento_realizado
      FROM participacion p
      JOIN asistentes a ON p.asistente_id = a.id
      JOIN eventos e ON p.evento_id = e.id
      WHERE p.evento_id = ?;
    `;

      const resultados = await this.db.consultar(sql, [eventoId]);
      if (resultados.length === 0) {
        return [];
      }
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al buscar los asistentes del evento:", error);
      throw new Error("Error al buscar los asistentes del evento");
    }
  }

  mapearResultados(resultados: any[]): IParticipacion[] {
    const participacionesMap: { [key: number]: IParticipacion } = {};

    resultados.forEach((resultado) => {
      if (!participacionesMap[resultado.id]) {
        participacionesMap[resultado.id] = {
          id: resultado.id,
          confirmacion: resultado.confirmacion,
          asistencia_real: resultado.asistencia_real,
          evento_id: resultado.evento_id,
          asistente: {
            id: resultado.asistente_id,
            nombre: resultado.asistente_nombre,
            apellido: resultado.asistente_apellido,
            email: resultado.asistente_email,
            telefono: resultado.asistente_telefono,
            dni: resultado.asistente_dni,
          },
          evento: {
            id: resultado.evento_id,
            nombre: resultado.evento_nombre,
            ubicacion: resultado.evento_ubicacion,
            fecha: resultado.evento_fecha,
            descripcion: resultado.evento_descripcion,
            realizado: resultado.evento_realizado,
          },
        };
      }
    });

    return Object.values(participacionesMap);
  }

  private mapearEventos(resultados: any[]): IEventos[] {
    return resultados.map((resultado) => ({
      id: resultado.evento_id || null,
      nombre: resultado.evento_nombre || null,
      ubicacion: resultado.evento_ubicacion || null,
      fecha: resultado.evento_fecha || null,
      descripcion: resultado.evento_descripcion || null,
      realizado: resultado.evento_realizado || null,
    }));
  }
}
export default RepoParticipacion;
