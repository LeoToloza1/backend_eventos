import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";
import Auth from "../middleware/auth";

class UsuarioRouter {
  private router = Router();
  private readonly usuarioController: UsuarioController;
  private _auth = new Auth();
  constructor(_usuarioController: UsuarioController) {
    this.usuarioController = _usuarioController;
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
      this._auth.verificarRol(["usuario"]),
      this.usuarioController.getAll
    ); //✅
    this.router.post("/login", this.usuarioController.loginUsuario);
    this.router.get(
      "/:id",
      this._auth.autenticado,
      this.usuarioController.getId
    ); //✅
    this.router.post(
      "/crear",
      this._auth.autenticado,
      this._auth.verificarRol(["usuario"]),
      this.usuarioController.post
    ); //✅
    this.router.put(
      "/actualizar/:id",
      this._auth.autenticado,
      this.usuarioController.put
    ); //✅
    this.router.patch(
      "/parcial/:id",
      this._auth.autenticado,
      this.usuarioController.patch
    ); //✅
    this.router.patch("/recuperar_pass", this.usuarioController.recueprarPass); //✅ recuperar contrasñea mediante email
    this.router.patch(
      "/cambiar_pass",
      this._auth.autenticado,
      this.usuarioController.cambiarContraseña
    );
    this.router.get(
      "/perfil",
      this._auth.autenticado,
      this.usuarioController.getId
    );
    this.router.get("/perfil/:id", this.usuarioController.refreshToken);
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

export default UsuarioRouter;
