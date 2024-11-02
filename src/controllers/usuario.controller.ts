import { Request, Response } from "express";
import RepoUsuario from "../repository/usuario.repository";
import HasheoService from "../services/hash.service";
import { GeneradorAleatorio } from "../services/generadorAleatorio.service";
import { EmailService } from "../services/mailer.service";
import { JwtService } from "../services/jwt.service";

class UsuarioController {
  private readonly _repoUsuario: RepoUsuario;
  private readonly emailService = new EmailService();
  private readonly jwt: JwtService;

  /**
   * Constructor de la clase UsuarioController.
   *
   * @param {RepoUsuario} repoUsuario - La instancia del repositorio de usuarios.
   */
  constructor(repoUsuario: RepoUsuario) {
    this._repoUsuario = repoUsuario;
    this.jwt = new JwtService(
      process.env.JWT_SECRET || "mi_secreto_de_ejemplo"
    );
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.recueprarPass = this.recueprarPass.bind(this);
    this.loginUsuario = this.loginUsuario.bind(this);
  }

  /**
   * Realiza el inicio de sesión de un usuario.
   *
   * @param {Request} req - La petición HTTP con el cuerpo que contiene el email y la contraseña del usuario.
   * @param {Response} res - La respuesta HTTP con el token de inicio de sesión.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se termina de procesar el inicio de sesión.
   * @throws {Error} - Si ocurre un error al procesar el inicio de sesión.
   */
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

      const token = this.jwt.generarToken({
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

  /**
   * Obtiene todos los usuarios de la base de datos.
   *
   * @param {Request} _req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener los usuarios.
   * @throws {Error} - Si ocurre un error al obtener los usuarios.
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this._repoUsuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  /**
   * Obtiene un usuario por su id.
   *
   * @param {Request} req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener el usuario.
   * @throws {Error} - Si ocurre un error al obtener el usuario.
   */
  async getId(req: Request, res: Response): Promise<void> {
    const id = req.user?.userId;
    try {
      const usuario = await this._repoUsuario.buscarPorId(Number(id));
      if (usuario === null) {
        res
          .status(404)
          .json({ error: "No se encuentra el usuario, intente de nuevo" });
        return;
      }
      res.json(usuario);
    } catch (error) {
      console.error(`Error al obtener usuario con id ${id}:`, error);
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos del nuevo usuario.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de crear el usuario.
   * @throws {Error} - Si ocurre un error al crear el usuario.
   */
  async post(_req: Request, res: Response): Promise<void> {
    try {
      const usuario: IUsuario = _req.body;
      const resultado = await this._repoUsuario.crear(usuario);
      res.json(resultado);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  /**
   * Actualiza un usuario existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del usuario.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el usuario.
   * @throws {Error} - Si ocurre un error al actualizar el usuario.
   */
  async put(_req: Request, res: Response): Promise<void> {
    const id = _req.user?.userId;
    const usuario: IUsuario = _req.body;
    try {
      const resultado = await this._repoUsuario.actualizar(Number(id), usuario);
      res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el usuario con id ${id}:`, error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }
  /**
   * Actualiza parcialmente un usuario existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del usuario.
   * @param {Response} _res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el usuario.
   * @throws {Error} - Si ocurre un error al actualizar el usuario.
   */
  async patch(_req: Request, _res: Response): Promise<void> {
    const id = _req.user?.userId;
    const usuario: IUsuario = _req.body;
    try {
      const resultado = await this._repoUsuario.actualizar(Number(id), usuario);
      _res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el usuario con id ${id}:`, error);
      _res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }

  /**
   * Recupera la contraseña de un usuario mediante su dirección de correo electrónico.
   * Genera una nueva contraseña aleatoria, la actualiza en la base de datos y
   * la envía al usuario por correo electrónico.
   *
   * @param {Request} req - La solicitud HTTP que contiene el email del usuario.
   * @param {Response} res - La respuesta HTTP que indica el resultado de la operación.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se completa la operación.
   * @throws {Error} - Si ocurre un error al procesar la solicitud de recuperación de contraseña.
   */
  async recueprarPass(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
      const asistente = await this._repoUsuario.obtenerPorEmail(email);

      if (!asistente) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      const nuevaContraseña = GeneradorAleatorio.generarContraseñaAleatoria(10); //numero de caracteres
      asistente.password = await HasheoService.hashPassword(nuevaContraseña);
      const actualizado = await this._repoUsuario.actualizarContraseña(
        asistente.id,
        asistente.password
      );

      if (!actualizado) {
        res.status(500).json({ message: "Error al actualizar la contraseña." });
        return;
      }
      await this.emailService.enviarCorreo(
        email,
        "Nueva Contraseña",
        `Hola ${asistente.nombre},
        La nueva contraseña de su cuenta es: ${nuevaContraseña}\n
        Por su seguridad cambiela inmediatamente despues de ingresar a la plataforma`
      );

      res.status(200).json({
        message: "Contraseña actualizada y enviada por correo electrónico.",
      });
    } catch (error) {
      console.error("Error al procesar la solicitud de contraseña:", error);
      res.status(500).json({ message: "Error al procesar la solicitud." });
    }
  }

  /**
   * Cambia la contraseña de un usuario existente.
   *
   * @param {Request} req - La solicitud HTTP con el cuerpo que contiene
   *                         la nueva contraseña.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de cambiar la contraseña.
   * @throws {Error} - Si ocurre un error al cambiar la contraseña.
   */
  async cambiarContraseña(req: Request, res: Response): Promise<void> {
    const passwordNueva = req.body;
    const email = req.user?.userEmail || "";
    try {
      const asistente = await this._repoUsuario.obtenerPorEmail(email);

      if (!asistente) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      asistente.password = await HasheoService.hashPassword(passwordNueva);
      const actualizado = await this._repoUsuario.actualizarContraseña(
        asistente.id,
        asistente.password
      );
      if (!actualizado) {
        res.status(500).json({ message: "Error al actualizar la contraseña." });
        return;
      }

      // await this.emailService.enviarCorreo(
      //   email,
      //   "Contraseña actualizada",
      //   `Su contraseña ha sido actualizada exitosamente.\n
      //   Por su seguridad, asegúrese de recordar su nueva contraseña.`
      // );
      res.status(200).json({
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al procesar la solicitud de contraseña:", error);
      res.status(500).json({ message: "Error al procesar la solicitud." });
    }
  }
}

export default UsuarioController;
