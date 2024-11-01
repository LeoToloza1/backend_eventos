import { Router } from "express";
import LoginAsistenteController from "../controllers/loginAsistente.controller";
export default class LoginAsistenteRouter {
  private router = Router();
  private readonly _loginAsistente: LoginAsistenteController;
  /**
   *
   */
  constructor(loginAsistente: LoginAsistenteController) {
    this._loginAsistente = loginAsistente;
    this.configurarRutas();
  }
  private configurarRutas(): void {
    console.log("llega al router de login asistente");
    this.router.post("/", this._loginAsistente.loginAsistente);
  }
  getRouter(): Router {
    return this.router;
  }
}
