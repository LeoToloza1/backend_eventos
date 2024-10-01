import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";

class UsuarioRouter {
  private router = Router();
  private readonly usuarioController: UsuarioController;
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
    this.router.get("/", this.usuarioController.getAll); //✅
    this.router.get("/:id", this.usuarioController.getId); //✅
    this.router.post("/crear", this.usuarioController.post); //✅
    this.router.put("/actualizar/:id", this.usuarioController.put); //✅
    this.router.patch("/parcial/:id", this.usuarioController.patch); //✅
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
