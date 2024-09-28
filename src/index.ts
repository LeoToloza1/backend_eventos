import express from "express";
import morgan from "morgan";
import ServidorAbstract from "./Servidor.Abstract";
import { config } from "dotenv";

config();

class Servidor extends ServidorAbstract {
  private app: express.Application;

  constructor() {
    super();
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  private configurarMiddlewares(): void {
    config();
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }

  private configurarRutas(): void {
    this.app.use("/asistentes", this.asistenteRouter.getRouter());
  }

  public iniciarServidor(): void {
    const puerto = process.env.PORT || 3000;
    this.app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  }
}

const servidor = new Servidor();
servidor.iniciarServidor();
