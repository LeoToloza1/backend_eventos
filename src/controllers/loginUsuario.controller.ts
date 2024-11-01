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

  async loginUsuario(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "El email y la contraseña son requeridos." });
      return;
    }
    try {
      const usuario = await this._repoUsuario.obtenerPorEmail(email);
      if (!usuario) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      const passwordEsValido = await HasheoService.comparePassword(
        password,
        usuario.password
      );
      if (!passwordEsValido) {
        res.status(401).json({ message: "Credenciales inválidas." });
        return;
      }

      const token = this.auth.generarToken({
        userId: usuario.id,
        userEmail: usuario.email,
        userName: usuario.nombre,
        role: "usuario",
      });
      res.status(200).json({
        message: "Inicio de sesión exitoso.",
        token,
      });
    } catch (error) {
      console.error("Error al procesar el inicio de sesión:", error);
      res.status(500).json({ message: "Error al procesar la solicitud." });
    }
  }
}

export default LoginUsuario;
