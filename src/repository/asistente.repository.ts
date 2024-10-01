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
  async buscarPorId(id: number): Promise<IAsistente | null> {
    try {
      const resultados = await this.db.consultar(
        "SELECT * FROM asistentes WHERE id = ?",
        [id]
      );
      if (resultados.length === 0) {
        return null;
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
  async crear(item: IAsistente): Promise<IAsistente | null> {
    try {
      const sql =
        "INSERT INTO asistentes (nombre, apellido, email, telefono, dni) VALUES (?, ?, ?, ?, ?)";
      const { nombre, apellido, email, telefono, dni } = item;
      await this.db.consultar(sql, [nombre, apellido, email, telefono, dni]);
      return item; //devuelve el asistente creado
    } catch (error) {
      console.error("Error al crear el asistente:", error);
      return null;
    }
  }

  /**
   * Actualiza un asistente existente en la base de datos, de manera dinamica
   *
   * @param {number} id - El id del asistente a actualizar.
   * @param {Partial<IAsistente>} item - Un objeto con las propiedades del
   *                                    asistente a actualizar.
   * @returns {Promise<IAsistente | boolean>} - El objeto Asistente actualizado
   *                                           o false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar el asistente.
   */
  async actualizar(
    id: number,
    item: Partial<IAsistente>
  ): Promise<IAsistente | boolean> {
    try {
      /**
       * obtener los campos de la consulta a ejecutar de manera dinamica
       * segun las propiedades que envie el objeto
       */
      const campos = Object.keys(item)
        .filter((key) => item[key as keyof IAsistente] !== undefined)
        .map((key) => `${key} = ?`);
      const valores = Object.values(item).filter(
        (valor) => valor !== undefined
      );

      if (campos.length === 0) {
        throw new Error("No hay campos para actualizar");
      }
      const sql = `UPDATE asistentes SET ${campos.join(", ")} WHERE id = ?`;
      await this.db.consultar(sql, [...valores, id]);
      return true;
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
