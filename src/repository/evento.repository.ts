import Conectar from "../db/config_db";
class RepoEvento implements ICrud<IEventos>, IMapeo<IEventos> {
  constructor(private readonly db: Conectar) {}

  /**
   * Obtiene todos los eventos de la base de datos.
   *
   * @returns {Promise<IEventos[]>} - Un array de objetos IEventos
   *                                  con los resultados de la consulta.
   * @throws {Error} - Si ocurre un error al obtener todos los eventos.
   */
  async obtenerTodos(): Promise<IEventos[]> {
    try {
      const sql =
        "SELECT id,nombre,ubicacion,DATE_FORMAT(fecha, '%d-%m-%y') AS fecha,descripcion,realizado FROM eventos ORDER BY fecha";
      const resultados = await this.db.consultar(sql);
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los eventos:", error);
      throw new Error("Error al obtener todos los eventos");
    }
  }
  /**
   * Obtiene todos los eventos que no han sido realizados de la base de datos.
   *
   * @returns {Promise<IEventos[]>} - Un array de objetos IEventos con los
   *                                  resultados de la consulta de eventos no realizados.
   * @throws {Error} - Si ocurre un error al obtener los eventos no realizados.
   */
  async obtenerActivos(): Promise<IEventos[]> {
    try {
      const sql =
        "SELECT id,nombre,ubicacion,DATE_FORMAT(fecha, '%d-%m-%y') AS fecha,descripcion,realizado FROM eventos where realizado = 0 ORDER BY fecha";
      const resultados = await this.db.consultar(sql);
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los eventos:", error);
      throw new Error("Error al obtener todos los eventos");
    }
  }
  /**
   * Busca un evento por su id.
   *
   * @param {number} id - El id del evento a buscar.
   * @returns {Promise<null | IEventos>} - Un objeto IEventos con los
   *                                          resultados de la consulta o
   *                                          false si no se encuentra un
   *                                          evento con el id especificado.
   * @throws {Error} - Si ocurre un error al buscar el evento con el id
   *                  especificado.
   */

  async buscarPorId(id: number): Promise<IEventos | null> {
    try {
      const sql =
        "SELECT id,nombre,ubicacion,DATE_FORMAT(fecha, '%d-%m-%y') AS fecha,descripcion,realizado FROM eventos WHERE id = ?";
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

  /**
   * Crea un nuevo evento en la base de datos.
   *
   * @param {Evento} item - El objeto Evento con los datos del nuevo
   *                        evento.
   * @returns {Promise<boolean | IEventos>} - El objeto Evento creado o
   *                                          false si ocurre un error.
   * @throws {Error} - Si ocurre un error al crear el evento.
   */
  async crear(item: IEventos): Promise<null | IEventos> {
    try {
      const sql =
        "INSERT INTO eventos (nombre, ubicacion, fecha, descripcion) VALUES (?, ?, ?, ?)";
      const { nombre, ubicacion, fecha, descripcion } = item;
      console.log(
        "sql -->",
        await this.db.consultar(sql, [nombre, ubicacion, fecha, descripcion])
      );
      console.log("evento creado -->", item);
      return item;
    } catch (error) {
      console.error("Error al crear el evento:", error);
      return null;
    }
  }

  /**
   * Actualiza un evento existente en la base de datos, de manera dinamica
   *
   * @param {number} id - El id del evento a actualizar.
   * @param {Partial<IEventos>} item - Un objeto con las propiedades del
   *                                    evento a actualizar.
   * @returns {Promise<boolean | IEventos>} - El objeto Evento actualizado
   *                                           o false si ocurre un error.
   * @throws {Error} - Si ocurre un error al actualizar el evento.
   */
  async actualizar(
    id: number,
    item: Partial<IEventos>
  ): Promise<boolean | IEventos> {
    try {
      const campos = Object.keys(item)
        .filter((key) => item[key as keyof IEventos] !== undefined)
        .map((key) => `${key} = ?`);
      const valores = Object.values(item).filter(
        (valor) => valor !== undefined
      );

      if (campos.length === 0) {
        throw new Error("No hay campos para actualizar");
      }
      const sql = `UPDATE eventos SET ${campos.join(", ")} WHERE id = ?`;
      await this.db.consultar(sql, [...valores, id]);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el evento con id ${id}:`, error);
      return false;
    }
  }

  /**
   * Mapea los resultados de una consulta a una lista de objetos Eventos.
   *
   * @param {any[]} resultados - Los resultados de la consulta.
   * @returns {IEventos[]} - Un array de objetos Eventos con los
   *                         resultados de la consulta.
   * @private
   */
  mapearResultados(resultados: any[]): IEventos[] {
    return resultados.map((resultado) => ({
      id: resultado.id,
      nombre: resultado.nombre,
      ubicacion: resultado.ubicacion,
      fecha: resultado.fecha,
      descripcion: resultado.descripcion,
      realizado: resultado.realizado,
    }));
  }
}

export default RepoEvento;
