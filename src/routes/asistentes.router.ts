import { Router } from "express";
import AsistenteController from "../controllers/asistente.controller";

class AsistenteRouter {
  private router = Router();
  private readonly asistenteController: AsistenteController;
  constructor(_asistenteControler: AsistenteController) {
    this.asistenteController = _asistenteControler;
    this.configurarRutas();
  }

  /**
   * Configura las rutas para el router de express.
   *
   * Establece las siguientes rutas:
   *
   * - GET / : Obtiene todos los asistentes de la base de datos.
   * - GET /:id : Obtiene un asistente por su id.
   * - POST /crear : Crea un nuevo asistente en la base de datos.
   * - PUT /actualizar/:id : Actualiza un asistente existente en la base de datos.
   * - PATCH /parcial/:id : Actualiza parcialmente un asistente existente en la base de datos.
   */
  private configurarRutas(): void {
    this.router.get(
      "/",
      this.asistenteController.getAll.bind(this.asistenteController)
    ); //✅
    this.router.get(
      "/:id",
      this.asistenteController.getId.bind(this.asistenteController)
    ); //✅
    this.router.post(
      "/crear",
      this.asistenteController.post.bind(this.asistenteController)
    ); //✅
    this.router.put(
      "/actualizar/:id",
      this.asistenteController.put.bind(this.asistenteController)
    ); //✅

    this.router.patch(
      "/parcial/:id",
      this.asistenteController.patch.bind(this.asistenteController)
    ); //✅
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
