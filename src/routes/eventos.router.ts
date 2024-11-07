import { Router } from "express";
import EventoController from "../controllers/evento.controller";
import Auth from "../middleware/auth";

class EventosRouter {
  private router = Router();
  private readonly eventoController: EventoController;
  private readonly _auth = new Auth();

  constructor(eventoControler: EventoController) {
    this.eventoController = eventoControler;
    this.configurarRutas();
  }
  private configurarRutas(): void {
    this.router.get(
      "/",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.eventoController.getAll
    );
    this.router.get(
      "/activos",
      this._auth.autenticado,
      this.eventoController.getAllActive
    );
    this.router.get(
      "/:id",
      this._auth.autenticado,
      this.eventoController.getId
    );
    this.router.post(
      "/crear",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.eventoController.post
    );
    this.router.put(
      "/actualizar/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.eventoController.put
    );
    this.router.patch(
      "/parcial/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.eventoController.patch
    );
    this.router.get(
      "/nombre",
      this._auth.autenticado,
      this.eventoController.buscarPorNombre
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default EventosRouter;
