import Conectar from "../db/config_db";

class RepoUsuario implements ICrud<IUsuario>, IMapeo<IUsuario> {
  constructor(private readonly db: Conectar) {}

  /**
   * Mapea los resultados de una consulta a una lista de objetos IUsuario.
   *
   * @param {any[]} resultados - Los resultados de la consulta.
   * @returns {IUsuario[]} - Un array de objetos IUsuario con los
   *                         resultados de la consulta.
   * @private
   */
  mapearResultados(resultados: any[]): IUsuario[] {
    return resultados.map((resultado) => ({
      id: resultado.id,
      nombre: resultado.nombre,
      apellido: resultado.apellido,
      email: resultado.email,
      telefono: resultado.telefono,
      dni: resultado.dni,
      password: null,
      rol_id: resultado.rol_id,
      rol: {
        rol: resultado.rol_nombre,
      },
    }));
  }

  /**
   * Obtiene todos los usuarios de la base de datos.
   *
   * @returns {Promise<IUsuario[]>} - Un array de objetos IUsuario
   *                                  con los resultados de la consulta.
   * @throws {Error} - Si ocurre un error al obtener todos los usuarios.
   */
  async obtenerTodos(): Promise<IUsuario[]> {
    try {
      const resultados = await this.db.consultar(
        "SELECT *,roles.nombre as rol_nombre FROM usuarios join roles on usuarios.rol_id = roles.id"
      );
      console.log(this.mapearResultados(resultados));
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw new Error("Error al obtener todos los usuarios");
    }
  }
  /**
   * Busca un usuario por su id.
   *
   * @param {number} id - El id del usuario a buscar.
   * @returns {Promise<IUsuario | null>} - Un objeto IUsuario con los
   *                                       resultados de la consulta o null
   *                                       si no se encuentra un usuario
   *                                       con el id especificado.
   * @throws {Error} - Si ocurre un error al buscar el usuario con el id
   *                  especificado.
   */
  async buscarPorId(id: number): Promise<IUsuario | null> {
    try {
      const resultados = await this.db.consultar(
        "SELECT *,roles.nombre as rol_nombre FROM usuarios join roles on usuarios.rol_id = roles.id WHERE usuarios.id = ?",
        [id]
      );
      if (resultados.length === 0) {
        return null;
      }
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al buscar el usuario con id ${id}:`, error);
      throw new Error(`Error al buscar el usuario con id ${id}`);
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * @param {IUsuario} item - El objeto IUsuario con los datos del nuevo
   *                           usuario.
   * @returns {Promise<IUsuario | null>} - El objeto IUsuario creado o null si
   *                                       ocurre un error.
   * @throws {Error} - Si ocurre un error al crear el usuario.
   */
  async crear(item: IUsuario): Promise<IUsuario | null> {
    try {
      const sql =
        "INSERT INTO usuarios (nombre, apellido, email, password,rol_id, telefono, dni) VALUES (?, ?, ?, ?, ?,?,?)";
      const { nombre, apellido, email, telefono, dni, password, rol_id } = item;
      await this.db.consultar(sql, [
        nombre,
        apellido,
        email,
        password,
        rol_id,
        telefono,
        dni,
      ]);
      return item; //devuelve el  creado
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return null;
    }
  }
  /**
   * Actualiza un usuario existente en la base de datos, de manera dinamica
   *
   * @param {number} id - El id del usuario a actualizar.
   * @param {Partial<IUsuario>} item - Un objeto con las propiedades del
   *                                    usuario a actualizar.
   * @returns {Promise<IUsuario | boolean>} - El objeto IUsuario actualizado
   *                                           o false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar el usuario.
   */

  async actualizar(
    id: number,
    item: Partial<IUsuario>
  ): Promise<IUsuario | boolean> {
    try {
      /**
       * obtener los campos de la consulta a ejecutar de manera dinamica
       * segun las propiedades que envie el objeto
       */
      const campos = Object.keys(item)
        .filter((key) => item[key as keyof IUsuario] !== undefined)
        .map((key) => `${key} = ?`);
      const valores = Object.values(item).filter(
        (valor) => valor !== undefined
      );

      if (campos.length === 0) {
        throw new Error("No hay campos para actualizar");
      }
      const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
      await this.db.consultar(sql, [...valores, id]);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el usuario con id ${id}:`, error);
      return false;
    }
  }
}
export default RepoUsuario;
