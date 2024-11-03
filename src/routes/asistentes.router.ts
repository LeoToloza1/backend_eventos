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
    this.router.get(
      "/",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.asistenteController.getAll
    ); //✅
    this.router.post("/login", this.asistenteController.loginAsistente);
    this.router.get(
      "/:id",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario", "asistente"]),
      this.asistenteController.getId
    ); //✅
    this.router.post("/crear", this.asistenteController.post); //✅
    this.router.put(
      "/actualizar/:id",
      this._auth.autenticado,
      this.asistenteController.put
    ); //✅
    this.router.patch(
      "/parcial/:id",
      this._auth.autenticado,
      this.asistenteController.patch
    ); //✅
    this.router.patch(
      "/recuperar_password",
      this.asistenteController.recuperarPass
    ); //✅ recupero de contraseña por email
    this.router.patch(
      "/password",
      this._auth.autenticado,
      this.asistenteController.cambiarContraseña
    ); //✅ cambiar contraseña
    this.router.get(
      "/perfil",
      this._auth.autenticado,
      this._auth.verificarRol(["asistente"]),
      this.asistenteController.getId
    ); //✅
    this.router.get("/perfil/:id", this.asistenteController.refreshToken);
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
