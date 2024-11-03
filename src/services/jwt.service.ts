import jwt, { JwtPayload } from "jsonwebtoken";

export class JwtService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Genera un token JWT para un usuario.
   *
   * @param {Object} payload - Datos que se incluirán en el token.
   * @param {number} expiresIn - Tiempo de expiración en segundos.
   * @returns {string} - Token JWT.
   */
  public generarToken(payload: object, expiresIn: number = 3600): string {
    console.log("Llega a generar token");
    return jwt.sign(payload, this.secret, { expiresIn }); //1 hora por defecto
  }

  /**
   * Genera un token JWT de refresh para un usuario.
   *
   * @param {Object} payload - Datos que se incluirán en el token.
   * @param {number} expiresIn - Tiempo de expiración en segundos.
   * @returns {string} - Token JWT de refresh.
   */
  public generarRefreshToken(
    payload: object,
    expiresIn: number = 2592000
  ): string {
    console.log("Llega a generar refresh token");
    return jwt.sign(payload, this.secret, { expiresIn }); // 30 días por defecto
  }

  /**
   * Verifica un token JWT y devuelve su contenido decodificado.
   *
   * @param {string} token - Token JWT a verificar.
   * @returns {JwtPayload | string} - Datos decodificados del token o un mensaje de error.
   */
  public verificarToken(token: string): JwtPayload {
    try {
      console.log("Llega a verificar token");
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error("Token inválido o expirado" + error);
    }
  }
}
