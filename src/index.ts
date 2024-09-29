import express from "express";
import morgan from "morgan";
import ServidorAbstract from "./Servidor.Abstract";
import { config } from "dotenv";

config();

class Servidor extends ServidorAbstract {
  private app: express.Application;

  /**
   * Constructor de la clase Servidor.
   *
   * Inicializa la aplicacion express y configura los middlewares y las rutas
   * para el servidor.
   */
  constructor() {
    super();
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }
  /**
   * Configura los middlewares para la aplicacion express.
   *
   * Establece los siguientes middlewares:
   *
   * - morgan con el formato "dev" para registrar las solicitudes y respuestas
   * - express.json() para parsear el cuerpo de las solicitudes en formato JSON
   * - express.urlencoded() para parsear el cuerpo de las solicitudes en formato
   *   urlencoded
   * - express.static("public") para servir archivos est ticos en la carpeta "public"
   */
  private configurarMiddlewares(): void {
    config();
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }

  /**
   * Configura las rutas para la aplicacion express.
   *
   * Establece la ruta "/asistentes" para que sea manejada por el router
   * de asistentes.
   */
  private configurarRutas(): void {
    this.app.use("/asistentes", this.asistenteRouter.getRouter());
    this.app.use("/eventos", this.eventosRouter.getRouter());
  }

  /**
   * Inicia el servidor web.
   *
   * Establece el puerto de escucha para el servidor en el valor de la
   * variable de entorno PORT, o en el puerto 3000 si no esta  definida.
   * Luego, inicia el servidor con el m todo listen() de express.
   */
  public iniciarServidor(): void {
    const puerto = process.env.PORT || 3000;
    this.app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  }
}

const servidor = new Servidor();
servidor.iniciarServidor();
