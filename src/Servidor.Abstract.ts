import Conectar from "./db/config_db";
import RepoAsistente from "./repository/asistente.repository";
import AsistenteController from "./controllers/asistente.controller";
import AsistenteRouter from "./routes/asistentes.router";
import EventoController from "./controllers/evento.controller";
import EventosRouter from "./routes/eventos.router";
import RepoEvento from "./repository/evento.repository";
import RepoParticipacion from "./repository/participacion.repository";
import ParticipacionController from "./controllers/participacion.controller";
import ParticipacionRouter from "./routes/participacion.router";
import UsuarioController from "./controllers/usuario.controller";
import UsuarioRouter from "./routes/usuarios.router";
import RepoUsuario from "./repository/usuario.repository";
import { EmailService } from "./services/mailer.service";
import LoginAsistenteController from "./controllers/loginAsistente.controller";
import LoginAsistenteRouter from "./routes/loginAsistente.router";

abstract class ServidorAbstract {
  protected db: Conectar;
  protected repoAsistente: RepoAsistente;
  protected asistenteController: AsistenteController;
  protected asistenteRouter: AsistenteRouter;
  protected eventoController: EventoController;
  protected eventosRouter: EventosRouter;
  protected repoEvento: RepoEvento;
  protected participacionController: ParticipacionController;
  protected participacionRouter: ParticipacionRouter;
  protected repoParticipacion: RepoParticipacion;
  protected usuarioController: UsuarioController;
  protected usuarioRouter: UsuarioRouter;
  protected repoUsuario: RepoUsuario;
  protected _emailService: EmailService;
  protected _loginAsistente: LoginAsistenteController;
  protected _loginAsistenteRouter: LoginAsistenteRouter;

  /**
   * Constructor de la clase abstracta ServidorAbstract.
   * Crea las instancias de los objetos que se van a utilizar
   * para interactuar con la base de datos y crear el router
   * de express para la gestion de asistentes.
   */
  constructor() {
    this._emailService = new EmailService();
    this.db = Conectar.obtenerInstancia();
    this.repoAsistente = new RepoAsistente(this.db);
    this.asistenteController = new AsistenteController(
      this.repoAsistente,
      this._emailService
    );
    this.asistenteRouter = new AsistenteRouter(this.asistenteController);
    this.repoEvento = new RepoEvento(this.db);
    this.eventoController = new EventoController(this.repoEvento);
    this.eventosRouter = new EventosRouter(this.eventoController);
    this.repoParticipacion = new RepoParticipacion(this.db);
    this.participacionController = new ParticipacionController(
      this.repoParticipacion
    );
    this.participacionRouter = new ParticipacionRouter(
      this.participacionController
    );
    this.repoUsuario = new RepoUsuario(this.db);
    this.usuarioController = new UsuarioController(this.repoUsuario);
    this.usuarioRouter = new UsuarioRouter(this.usuarioController);
    this._loginAsistente = new LoginAsistenteController(this.repoAsistente);
    this._loginAsistenteRouter = new LoginAsistenteRouter(this._loginAsistente);
  }

  abstract iniciarServidor(): void;
}

export default ServidorAbstract;
