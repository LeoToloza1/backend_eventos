import { Router } from "express";
import AsistenteController from "../controllers/asistente.controller";

class AsistenteRouter {
  private router = Router();
  private readonly asistenteController: AsistenteController;
  constructor(_asistenteControler: AsistenteController) {
    this.router = Router();
    this.asistenteController = _asistenteControler;
    this.configurarRutas();
  }

  /**
   * Configura las rutas del router para la gesti n de asistentes.
   *
   * Configura las siguientes rutas:
   *
   * - GET /asistentes - Obtiene todos los asistentes.
   * - GET /asistentes/:id - Obtiene un asistente por su id.
   *
   * @private
   */
  private configurarRutas(): void {
    this.router.get(
      "/",
      this.asistenteController.getAll.bind(this.asistenteController)
    );
    this.router.get(
      "/:id",
      this.asistenteController.getId.bind(this.asistenteController)
    );
    // this.router.post("/asistentes", this.post.bind(this));
    // this.router.put("/asistentes/:id", this.put.bind(this));
    // this.router.patch("/asistentes/:id", this.patch.bind(this));
  }

  /**
   * Devuelve el router de express configurado para las rutas de asistentes.
   *
   * @returns {Router} - El router de express configurado.
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default AsistenteRouter;
