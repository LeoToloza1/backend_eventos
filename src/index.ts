import express, { Express } from "express";
import Conectar from "./db/config_db";
import { config } from "dotenv";
import morgan from "morgan";
import AsistenteRouter from "./routes/asistentes.router";

class Servidor {
  private app: Express;

  /**
   * Constructor de la clase Servidor.
   *
   * Inicializa la app de express, configura los middlewares, las rutas y
   * conecta a la base de datos.
   */
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
    this.iniciarBaseDeDatos();
  }

  /**
   * Configura los middlewares de la aplicaci n.
   *
   * Los middlewares configurados son:
   *
   * - morgan para registrar las peticiones en la consola.
   * - express.json() para parsear el cuerpo de las peticiones en formato json.
   * - express.urlencoded() para parsear el cuerpo de las peticiones en formato urlencoded.
   * - express.static() para servir archivos est ticos en el directorio "public".
   */
  private configurarMiddlewares() {
    config();
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }
  /**
   * Configura las rutas de la aplicaci n.
   *
   * Configura la ruta "/asistentes" para que se maneje con el router
   * AsistenteRouter.
   */
  private configurarRutas() {
    const asistenteRouter = new AsistenteRouter();
    this.app.use("/asistentes", asistenteRouter.getRouter());
  }

  /**
   * Inicializa la base de datos.
   *
   * La inicializacion de la base de datos se hace a traves de la
   * instancia de Conectar. Si ocurre un error al conectar a la base
   * de datos, se registra en la consola y se termina la ejecucion
   * de la aplicacion con codigo de estado 1.
   */
  private async iniciarBaseDeDatos() {
    try {
      const db = Conectar.obtenerInstancia();
      await db.conectar();
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
      process.exit(1);
    }
  }

  /**
   * Inicia el servidor.
   *
   * Inicia el servidor en el puerto especificado en la variable de
   * entorno "PORT" o en el puerto 3000 si no est  definida.
   *
   * @returns {void}
   */
  public iniciar() {
    const puerto = process.env.PORT || 3000;
    this.app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  }
}

const servidor = new Servidor();
servidor.iniciar();
