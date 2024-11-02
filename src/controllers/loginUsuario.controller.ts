// controllers/auth.controller.ts
import { Request, Response } from "express";
import RepoUsuario from "../repository/usuario.repository";
import HasheoService from "../services/hash.service";
import { JwtService } from "../services/jwt.service";

class LoginUsuario {
  private readonly _repoUsuario: RepoUsuario;
  private readonly auth: JwtService;

  constructor(repoUsuario: RepoUsuario) {
    this._repoUsuario = repoUsuario;
    this.auth = new JwtService(
      process.env.JWT_SECRET || "mi_secreto_de_ejemplo"
    );
    this.loginUsuario = this.loginUsuario.bind(this);
  }
}

export default LoginUsuario;
