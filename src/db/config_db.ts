/**
 * Uso patron singleton para manejar una unica instancia de de conexion
 * con la base de datos
 */

import mysql, { Connection } from "mysql2/promise";
import { config } from "dotenv";

config();

class Conectar {
  private static instancia: Conectar;
  private conexion: Connection | null = null;

  private constructor() {}

  public static obtenerInstancia(): Conectar {
    if (!Conectar.instancia) {
      Conectar.instancia = new Conectar();
    }
    return Conectar.instancia;
  }

  async conectar() {
    const config_db = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    this.conexion = await mysql.createConnection(config_db);
    console.log("Conexión a la base de datos establecida");
  }

  async consultar(sql: string, params?: any[]) {
    if (!this.conexion) {
      throw new Error("No está conectado a la base de datos");
    }
    const [resultados] = await this.conexion.execute(sql, params);
    return resultados;
  }

  async cerrar() {
    if (this.conexion) {
      await this.conexion.end();
      console.log("Conexión a la base de datos cerrada");
    }
  }
}
export default Conectar;
