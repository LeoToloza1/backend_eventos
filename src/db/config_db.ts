/**
 * Uso patron singleton para manejar una unica instancia de de conexion
 * con la base de datos
 */

import mysql, { Connection, RowDataPacket } from "mysql2/promise";
import { config } from "dotenv";
config();

class Conectar {
  private static instancia: Conectar;
  private conexion: Connection | null = null;

  private constructor() {
    this.conectar();
  }

  /**
   * Retorna la instancia de Conectar, creandola si no existe.
   *
   * @returns {Conectar} La instancia de Conectar.
   */
  public static obtenerInstancia(): Conectar {
    if (!Conectar.instancia) {
      Conectar.instancia = new Conectar();
    }
    return Conectar.instancia;
  }

  /**
   * Conecta a la base de datos solo una vez, utilizando las
   * variables de entorno para obtener los datos de configuración
   * de la base de datos.
   * @throws {Error} - Si no se pueden obtener los datos de configuración
   *                  de la base de datos
   */
  async conectar() {
    try {
      const esProduccion = process.env.NODE_ENV === "production";
      const config_db = {
        host: esProduccion
          ? process.env.DB_HOST_PRODUCTION
          : process.env.DB_HOST_DESARROLLO,
        port: Number(
          esProduccion
            ? process.env.DB_PORT_PRODUCTION
            : process.env.DB_PORT_DESARROLLO
        ),
        user: esProduccion
          ? process.env.DB_USER_PRODUCTION
          : process.env.DB_USER_DESARROLLO,
        password: esProduccion
          ? process.env.DB_PASSWORD_PRODUCTION
          : process.env.DB_PASSWORD_DESARROLLO,
        database: esProduccion
          ? process.env.DB_NAME_PRODUCTION
          : process.env.DB_NAME_DESARROLLO,
      };
      // console.log(config_db);
      this.conexion = await mysql.createConnection(config_db);
      console.log("Conexión a la base de datos establecida");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      throw new Error("Error al conectar a la base de datos");
    }
  }

  //el objeto RowDataPacket, provisto de mysql2, se usa para tipar los datos que devuelve la base de datos
  //ya que proporciona un mejor soporte de tipo en TypeScript.

  /**
   * Realiza una consulta a la base de datos
   * @param {string} sql - Consulta SQL a realizar
   * @param {any[]} [params] - Parámetros a insertar en la consulta
   * @returns {Promise<RowDataPacket[]>} - Resultados de la consulta
   * @throws {Error} - Si no se ha establecido una conexión a la base de datos
   */
  async consultar(sql: string, params?: any[]): Promise<RowDataPacket[]> {
    if (!this.conexion) {
      throw new Error("No está conectado a la base de datos");
    }
    const [resultados] = await this.conexion.execute<RowDataPacket[]>(
      sql,
      params
    );
    return resultados;
  }
  /**
   * Cierra la conexión a la base de datos
   * @throws {Error} - Si no se ha establecido una conexión a la base de datos
   */
  async cerrar() {
    if (this.conexion) {
      await this.conexion.end();
      console.log("Conexión a la base de datos cerrada");
    }
  }
}
export default Conectar;
