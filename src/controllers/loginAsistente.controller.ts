import { Request, Response } from "express";
import RepoAsistente from "../repository/asistente.repository";
import HasheoService from "../services/hash.service";
import { JwtService } from "../services/jwt.service";
class LoginAsistenteController {
  private readonly _repoAsistente: RepoAsistente;
  private readonly jwt: JwtService;

  constructor(repoAsistente: RepoAsistente) {
    this._repoAsistente = repoAsistente;
    this.jwt = new JwtService(
      process.env.JWT_SECRET || "mi_secreto_de_ejemplo"
    );
    this.loginAsistente = this.loginAsistente.bind(this);
  }

  async loginAsistente(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    console.log("USUARIO INTENTANDO INGRESAR: -->", email, password);
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "El email y la contraseña son requeridos." });
      return;
    }

    try {
      const asistente = await this._repoAsistente.obtenerPorEmail(email);
      if (!asistente) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      const passwordEsValido = await HasheoService.comparePassword(
        password,
        asistente.password
      );

      if (!passwordEsValido) {
        res.status(401).json({ message: "Credenciales inválidas." });
        return;
      }
      //se está creando un payload para el token, que incluye el userId, userEmail, userName, y el role del usuario. Esto es importante porque, al decodificar el token más tarde, se puede extraer esta información.
      const token = this.jwt.generarToken({
        userId: asistente.id,
        userEmail: asistente.email,
        userName: asistente.nombre,
        role: "asistente",
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

export default LoginAsistenteController;
