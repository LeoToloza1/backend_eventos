import Conectar from "../db/config_db";
class RepoAsistente implements ICrud<Asistente> {
  constructor(private readonly db: Conectar) {}

  /**
   * Obtiene todos los asistentes de la base de datos.
   *
   * @returns {Promise<Asistente[]>} - Un array de objetos Asistente
   *                                  con los resultados de la consulta.
   * @throws {Error} Si ocurre un error al obtener los asistentes.
   */
  async obtenerTodos(): Promise<Asistente[]> {
    try {
      const resultados = await this.db.consultar("SELECT * FROM asistentes");
      return resultados as Asistente[];
    } catch (error) {
      console.error("Error al obtener todos los asistentes:", error);
      throw new Error("Error al obtener todos los asistentes");
    }
  }

  /**
   * Busca un asistente por su id.
   *
   * @param {number} id - El id del asistente a buscar.
   * @returns {Promise<Asistente | null>} - Un objeto Asistente con los
   *                                       resultados de la consulta o null
   *                                       si no se encuentra un asistente
   *                                       con el id especificado.
   * @throws {Error} - Si ocurre un error al buscar el asistente con el id
   *                  especificado.
   */
  async buscarPorId(id: number): Promise<Asistente | null> {
    try {
      const resultados = await this.db.consultar(
        "SELECT * FROM asistentes WHERE id = ?",
        [id]
      );
      if (resultados.length === 0) {
        return null;
      }
      return resultados[0] as Asistente;
    } catch (error) {
      console.error(`Error al buscar el asistente con id ${id}:`, error);
      throw new Error(`Error al buscar el asistente con id ${id}`);
    }
  }

  /**
   * Crea un nuevo asistente en la base de datos.
   *
   * @param {Asistente} item - El objeto Asistente a crear.
   * @returns {Promise<boolean>} - `true` si el asistente se creo correctamente,
   *                              `false` en caso de error.
   * @throws {Error} - Si ocurre un error al crear el asistente.
   */
  async crear(item: Asistente): Promise<boolean> {
    try {
      const sql =
        "INSERT INTO asistentes (nombre, apellido, email, telefono, dni) VALUES (?, ?, ?, ?, ?)";
      const { nombre, apellido, email, telefono, dni } = item;
      await this.db.consultar(sql, [nombre, apellido, email, telefono, dni]);
      return true;
    } catch (error) {
      console.error("Error al crear el asistente:", error);
      return false;
    }
  }
  /**
   * Actualiza un asistente en la base de datos.
   *
   * @param {number} id - El id del asistente a actualizar.
   * @param {Asistente} item - El objeto Asistente con los datos a actualizar.
   * @returns {Promise<boolean>} - `true` si el asistente se actualizo correctamente,
   *                              `false` en caso de error.
   * @throws {Error} - Si ocurre un error al actualizar el asistente.
   */

  async actualizar(id: number, item: Asistente): Promise<boolean> {
    try {
      const sql =
        "UPDATE asistentes SET nombre = ?, apellido = ?, email = ?, telefono = ?, dni = ? WHERE id = ?";
      const { nombre, apellido, email, telefono, dni } = item;
      await this.db.consultar(sql, [
        nombre,
        apellido,
        email,
        telefono,
        dni,
        id,
      ]);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el asistente con id ${id}:`, error);
      return false;
    }
  }
}

export default RepoAsistente;
