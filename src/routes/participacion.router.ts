import { Router } from "express";
import ParticipacionController from "../controllers/participacion.controller";
import Auth from "../middleware/auth";

class ParticipacionRouter {
  private router = Router();
  private readonly participacionController: ParticipacionController;
  private readonly _auth = new Auth();

  constructor(participacionController: ParticipacionController) {
    this.participacionController = participacionController;
    this.configurarRutas();
  }
  private configurarRutas(): void {
    this.router.get(
      "/",
      this._auth.autenticado,
      this.participacionController.getAll
    );
    this.router.get(
      "/:id",
      this._auth.autenticado,
      this.participacionController.getId
    );
    this.router.post(
      "/crear",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario", "asistente"]),
      this.participacionController.post
    );
    this.router.put(
      "/actualizar/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario", "asistente"]),
      this.participacionController.put
    );
    this.router.patch(
      "/parcial/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario", "asistente"]),
      this.participacionController.patch
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default ParticipacionRouter;
