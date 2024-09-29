import Conectar from "../db/config_db";
class RepoAsistente implements ICrud<IAsistente>, IMapeo<IAsistente> {
  constructor(private readonly db: Conectar) {}

  /**
   * Obtiene todos los asistentes de la base de datos.
   *
   * @returns {Promise<IAsistente[]>} - Un array de objetos Asistente
   *                                  con los resultados de la consulta.
   * @throws {Error} Si ocurre un error al obtener los asistentes.
   */
  async obtenerTodos(): Promise<IAsistente[]> {
    try {
      const resultados = await this.db.consultar("SELECT * FROM asistentes");
      // console.log(this.mapearResultados(resultados));
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los asistentes:", error);
      throw new Error("Error al obtener todos los asistentes");
    }
  }

  /**
   * Busca un asistente por su id.
   *
   * @param {number} id - El id del asistente a buscar.
   * @returns {Promise<IAsistente | null>} - Un objeto Asistente con los
   *                                       resultados de la consulta o null
   *                                       si no se encuentra un asistente
   *                                       con el id especificado.
   * @throws {Error} - Si ocurre un error al buscar el asistente con el id
   *                  especificado.
   */
  async buscarPorId(id: number): Promise<IAsistente | boolean> {
    try {
      const resultados = await this.db.consultar(
        "SELECT * FROM asistentes WHERE id = ?",
        [id]
      );
      if (resultados.length === 0) {
        return false;
      }
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al buscar el asistente con id ${id}:`, error);
      throw new Error(`Error al buscar el asistente con id ${id}`);
    }
  }

  /**
   * Crea un nuevo asistente en la base de datos.
   *
   * @param {Asistente} item - El objeto Asistente con los datos del nuevo
   *                           asistente.
   * @returns {Promise<IAsistente>} - El objeto Asistente creado.
   * @throws {Error} - Si ocurre un error al crear el asistente.
   */
  async crear(item: IAsistente): Promise<IAsistente | boolean> {
    try {
      const sql =
        "INSERT INTO asistentes (nombre, apellido, email, telefono, dni) VALUES (?, ?, ?, ?, ?)";
      const { nombre, apellido, email, telefono, dni } = item;
      await this.db.consultar(sql, [nombre, apellido, email, telefono, dni]);
      return item; //devuelve el asistente creado
    } catch (error) {
      console.error("Error al crear el asistente:", error);
      return false;
    }
  }

  /**
   * Actualiza un asistente en la base de datos.
   *
   * @param {number} id - El id del asistente a actualizar.
   * @param {Asistente} item - El objeto Asistente con los datos actualizados.
   * @returns {Promise<Asistente | boolean>} - El objeto Asistente actualizado,
   *                                          o false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar el asistente.
   */
  async actualizar(
    id: number,
    item: IAsistente
  ): Promise<IAsistente | boolean> {
    try {
      const sql =
        "UPDATE asistentes SET nombre = ?, apellido = ?, email = ?, telefono = ?, dni = ? WHERE id = ?";
      const { nombre, apellido, email, telefono, dni } = item;
      const resultados = await this.db.consultar(sql, [
        nombre,
        apellido,
        email,
        telefono,
        dni,
        id,
      ]);
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al actualizar el asistente con id ${id}:`, error);
      return false;
    }
  }

  /**
   * Mapea los resultados de una consulta a una lista de objetos Asistente.
   *
   * @param {any[]} resultados - Los resultados de la consulta.
   * @returns {Asistente[]} - Un array de objetos Asistente con los
   *                         resultados de la consulta.
   * @private
   */
  mapearResultados(resultados: any[]): IAsistente[] {
    return resultados.map((resultado) => ({
      id: resultado.id,
      nombre: resultado.nombre,
      apellido: resultado.apellido,
      email: resultado.email,
      telefono: resultado.telefono,
      dni: resultado.dni,
    }));
  }
}

export default RepoAsistente;
