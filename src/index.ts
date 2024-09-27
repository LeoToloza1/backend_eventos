import express, { Express, Request, Response } from "express";
import Conectar from "./db/config_db";
import { config } from "dotenv";
import morgan from "morgan";

class Servidor {
  private app: Express;

  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
    this.iniciarBaseDeDatos();
  }

  private configurarMiddlewares() {
    config();
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }
  private async configurarRutas() {
    this.app.get("/", async (_req: Request, res: Response) => {
      try {
        const db = Conectar.obtenerInstancia();
        await db.conectar();
        const resultados = await db.consultar("SELECT * FROM asistentes");
        console.log(resultados);
        res.json(resultados);
      } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).json({ error: "Error al consultar la base de datos" });
      }
    });
  }

  private async iniciarBaseDeDatos() {
    try {
      const db = Conectar.obtenerInstancia();
      await db.conectar(); // Conectar a la base de datos solo una vez
      console.log(
        "Conexión a la base de datos establecida en el inicio del servidor."
      );
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      process.exit(1); // Salir si no se puede conectar a la base de datos
    }
  }
  public iniciar() {
    const puerto = process.env.PORT || 3000;
    this.app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  }
}

const servidor = new Servidor();
servidor.iniciar();
