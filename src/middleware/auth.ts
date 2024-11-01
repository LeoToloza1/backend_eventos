import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";

export default class Auth {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService(
      process.env.JWT_SECRET || "mi_secreto_de_ejemplo"
    );
    this.autenticado = this.autenticado.bind(this);
    this.verificarRol = this.verificarRol.bind(this);
  }

  public async autenticado(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Token no proporcionado." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token inválido." });
      return;
    }
    try {
      const decoded = this.jwtService.verificarToken(token); // Esto es JwtPayload
      req.user = {
        userId: decoded.userId,
        userEmail: decoded.userEmail,
        userName: decoded.userName,
        role: decoded.role,
      };
      next();
    } catch (error) {
      console.error("Error al verificar el token:", error);
      res.status(403).json({ message: "Token no válido." });
      return;
    }
  }

  public verificarRol(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = req.user;
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ message: "Acceso denegado." });
        return;
      }
      next();
    };
  }
}
