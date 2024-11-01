import { Router } from "express";
import AsistenteController from "../controllers/asistente.controller";
import Auth from "../middleware/auth";

class AsistenteRouter {
  private router = Router();
  private readonly asistenteController: AsistenteController;
  private _auth = new Auth();
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
    this.router.get("/", this.asistenteController.getAll); //✅
    this.router.get(
      "/:id",
      this._auth.autenticado,
      this.asistenteController.getId
    ); //✅
    this.router.post("/crear", this.asistenteController.post); //✅
    this.router.put("/actualizar/:id", this.asistenteController.put); //✅
    this.router.patch("/parcial/:id", this.asistenteController.patch); //✅
    this.router.patch("/cambiarPass", this.asistenteController.cambiarPass); //✅
    this.router.patch("/password", this.asistenteController.cambiarContraseña); //✅
    this.router.get(
      "/perfil",
      this._auth.autenticado,
      this.asistenteController.getId
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
