import Conectar from "../db/config_db";
import ValidadorService from "../services/validaciones.service";
import HasheoService from "../services/hash.service";
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
      const resultados = await this.db.consultar(
        "SELECT nombre,apellido,email,telefono,dni FROM asistentes"
      );

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
   * @param {IAsistente} item - El objeto IAsistente con los datos del nuevo
   *                            asistente.
   * @returns {Promise<IAsistente | null>} - Un objeto IAsistente con los datos
   *                                       del asistente creado o null si
   *                                       ocurre un error.
   * @throws {Error} - Si ocurre un error al crear el asistente.
   */
  async crear(item: IAsistente): Promise<IAsistente | null> {
    try {
      const resultado = ValidadorService.validarAsistente(item);
      if (!resultado.success) {
        console.error("Error de validación:", resultado.error.errors);
        return null;
      }
      item.password = await HasheoService.hashPassword(item.password);
      const sql =
        "INSERT INTO asistentes (nombre, apellido, email, password, telefono, dni) VALUES (?, ?, ?, ?, ?, ?)";
      const { nombre, apellido, email, telefono, dni } = item;

      await this.db.consultar(sql, [
        nombre,
        apellido,
        email,
        item.password,
        telefono,
        dni,
      ]);
      item.password = "********"; // Ocultar la contraseña
      return item;
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
   * Busca un asistente por su email.
   *
   * @param {string} email - El email del asistente a buscar.
   * @returns {Promise<IAsistente | null>} - Un objeto Asistente con los
   *                                       resultados de la consulta o null
   *                                       si no se encuentra un asistente
   *                                       con el email especificado.
   * @throws {Error} - Si ocurre un error al buscar el asistente con el email
   *                  especificado.
   */
  async obtenerPorEmail(email: string): Promise<IAsistente | null> {
    try {
      const resultados = await this.db.consultar(
        "SELECT * FROM asistentes WHERE email = ?",
        [email]
      );
      if (resultados.length === 0) {
        return null;
      }
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al buscar el asistente con email ${email}:`, error);
      throw new Error(`Error al buscar el asistente con email ${email}`);
    }
  }

  /**
   * Actualiza la contraseña de un asistente existente en la base de datos.
   *
   * @param {number} id - El id del asistente a actualizar.
   * @param {string} nuevaContraseña - La nueva contraseña a establecer.
   * @returns {Promise<boolean>} - true si se actualiza la contraseña
   *                              correctamente, false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar la contraseña del
   *                  asistente con el id especificado.
   */
  async actualizarContraseña(
    id: number,
    nuevaContraseña: string
  ): Promise<boolean> {
    try {
      const sql = `UPDATE asistentes SET password = ? WHERE id = ?`;
      await this.db.consultar(sql, [nuevaContraseña, id]);
      return true;
    } catch (error) {
      console.error(
        `Error al actualizar la contraseña del asistente con id ${id}:`,
        error
      );
      return false;
    }
  }

  /**
   * Actualiza el refresh token de un asistente en la base de datos.
   *
   * @param {number} id - El id del asistente cuyo refresh token se actualizará.
   * @param {string} refreshToken - El nuevo refresh token a establecer.
   * @returns {Promise<boolean>} - true si se actualiza el refresh token
   *                              correctamente, false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar el refresh token.
   */
  async actualizarRefreshToken(
    id: number,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const sql = `UPDATE asistentes SET refresh_token = ? WHERE id = ?`;
      await this.db.consultar(sql, [refreshToken, id]);
      return true;
    } catch (error) {
      console.error(
        `Error al actualizar el refresh token del asistente con id ${id}:`,
        error
      );
      return false;
    }
  }

  /**
   * Busca el refresh token de un asistente en la base de datos.
   *
   * @param {number} id - El id del asistente cuyo refresh token se buscará.
   * @returns {Promise<string | null>} - El refresh token del asistente o null
   *                                    si no se encuentra.
   * @throws {Error} - Si ocurre un error al buscar el refresh token del asistente.
   */
  async buscarRefreshToken(id: number): Promise<string | null> {
    try {
      const sql = `SELECT refresh_token FROM asistentes WHERE id = ?`;
      const resultados = await this.db.consultar(sql, [id]);
      if (resultados.length === 0) {
        return null;
      }
      return resultados[0].refresh_token;
    } catch (error) {
      console.error(
        `Error al buscar el refresh token del asistente con id ${id}:`,
        error
      );
      throw new Error(
        `Error al buscar el refresh token del asistente con id ${id}`
      );
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
      password: resultado.password,
      telefono: resultado.telefono,
      dni: resultado.dni,
    }));
  }
}

export default RepoAsistente;
