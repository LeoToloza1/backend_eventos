import Conectar from "./db/config_db";
import RepoAsistente from "./repository/asistente.repository";
import AsistenteController from "./controllers/asistente.controller";
import AsistenteRouter from "./routes/asistentes.router";

abstract class ServidorAbstract {
  protected db: Conectar;
  protected repoAsistente: RepoAsistente;
  protected asistenteController: AsistenteController;
  protected asistenteRouter: AsistenteRouter;

  /**
   * Constructor de la clase abstracta ServidorAbstract.
   * Crea las instancias de los objetos que se van a utilizar
   * para interactuar con la base de datos y crear el router
   * de express para la gesti n de asistentes.
   */
  constructor() {
    this.db = Conectar.obtenerInstancia();
    this.repoAsistente = new RepoAsistente(this.db);
    this.asistenteController = new AsistenteController(this.repoAsistente);
    this.asistenteRouter = new AsistenteRouter(this.asistenteController);
  }

  abstract iniciarServidor(): void;
}

export default ServidorAbstract;
