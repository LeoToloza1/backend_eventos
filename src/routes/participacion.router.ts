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
      "/por-evento",
      this._auth.autenticado,
      this.participacionController.partipacionPorEvento
    );
    this.router.get(
      "/mis-eventos",
      this._auth.autenticado,
      this.participacionController.eventosPorAsistente
    );
    this.router.get(
      "/evento-asistentes/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.participacionController.asistentesPorEvento
    );
    this.router.get(
      "/sin-confirmar",
      this._auth.autenticado,
      this.participacionController.eventosSinConfirmar
    );
    this.router.get(
      "/certificado/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["asistente"]),
      this.participacionController.generarCertificado
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

    this.router.get(
      "/confirmar",
      this._auth.autenticado,
      this._auth.verificarRol(["asistente"]),
      this.participacionController.confirmarAsistencia
    );

    this.router.patch(
      "/realizado",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.participacionController.asistenciaReal
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default ParticipacionRouter;
