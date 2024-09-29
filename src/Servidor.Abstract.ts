import Conectar from "./db/config_db";
import RepoAsistente from "./repository/asistente.repository";
import AsistenteController from "./controllers/asistente.controller";
import AsistenteRouter from "./routes/asistentes.router";
import EventoController from "./controllers/evento.controller";
import EventosRouter from "./routes/eventos.router";
import RepoEvento from "./repository/evento.repository";
abstract class ServidorAbstract {
  protected db: Conectar;
  protected repoAsistente: RepoAsistente;
  protected asistenteController: AsistenteController;
  protected asistenteRouter: AsistenteRouter;
  protected eventoController: EventoController;
  protected eventosRouter: EventosRouter;
  protected repoEvento: RepoEvento;
  /**
   * Constructor de la clase abstracta ServidorAbstract.
   * Crea las instancias de los objetos que se van a utilizar
   * para interactuar con la base de datos y crear el router
   * de express para la gestion de asistentes.
   */
  constructor() {
    this.db = Conectar.obtenerInstancia();
    this.repoAsistente = new RepoAsistente(this.db);
    this.asistenteController = new AsistenteController(this.repoAsistente);
    this.asistenteRouter = new AsistenteRouter(this.asistenteController);
    this.repoEvento = new RepoEvento(this.db);
    this.eventoController = new EventoController(this.repoEvento);
    this.eventosRouter = new EventosRouter(this.eventoController);
  }

  abstract iniciarServidor(): void;
}

export default ServidorAbstract;
