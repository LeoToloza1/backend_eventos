import { Request, Response } from "express";
import RepoAsistente from "../repository/asistente.repository";
import { EmailService } from "../services/mailer.service";
import HasheoService from "../services/hash.service";
import { GeneradorAleatorio } from "../services/generadorAleatorio.service";

class AsistenteController {
  private readonly _repoAsistente: RepoAsistente;
  private readonly emailService: EmailService;

  /**
   * Constructor de la clase AsistenteController.
   *
   * @param {RepoAsistente} repoAsistente - La instancia del repositorio de asistentes.
   */
  constructor(repoAsistente: RepoAsistente, emailService: EmailService) {
    this._repoAsistente = repoAsistente;
    this.emailService = emailService;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.cambiarPass = this.cambiarPass.bind(this);
    this.cambiarContraseña = this.cambiarContraseña.bind(this);
  }

  /**
   * Obtiene todos los asistentes de la base de datos.
   *
   * @param {Request} _req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener los asistentes.
   * @throws {Error} - Si ocurre un error al obtener los asistentes.
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const asistentes = await this._repoAsistente.obtenerTodos();
      res.json(asistentes);
    } catch (error) {
      console.error("Error al obtener asistentes:", error);
      res.status(500).json({ error: "Error al obtener asistentes" });
    }
  }

  /**
   * Obtiene un asistente por su id.
   *
   * @param {Request} req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener el asistente.
   * @throws {Error} - Si ocurre un error al obtener el asistente.
   */
  async getId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log("Payload JWT:", req.user);
    try {
      const asistente = await this._repoAsistente.buscarPorId(Number(id));
      if (asistente === null) {
        res
          .status(404)
          .json({ error: "No se encuentra el asistente, intente de nuevo" });
        return;
      }
      res.json(asistente);
    } catch (error) {
      console.error(`Error al obtener asistente con id ${id}:`, error);
      res.status(500).json({ error: "Error al obtener asistente" });
    }
  }

  /**
   * Crea un nuevo asistente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos del nuevo asistente.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de crear el asistente.
   * @throws {Error} - Si ocurre un error al crear el asistente.
   */
  async post(_req: Request, res: Response): Promise<void> {
    try {
      const asistente: IAsistente = _req.body;
      const resultado = await this._repoAsistente.crear(asistente);
      res.json(resultado);
    } catch (error) {
      console.error("Error al crear el asistente:", error);
      res.status(500).json({ error: "Error al crear el asistente" });
    }
  }

  /**
   * Actualiza un asistente existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del asistente.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el asistente.
   * @throws {Error} - Si ocurre un error al actualizar el asistente.
   */
  async put(_req: Request, res: Response): Promise<void> {
    const { id } = _req.params;
    const asistente: IAsistente = _req.body;
    try {
      const resultado = await this._repoAsistente.actualizar(
        Number(id),
        asistente
      );
      res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el asistente con id ${id}:`, error);
      res.status(500).json({ error: "Error al actualizar el asistente" });
    }
  }

  /**
   * Actualiza parcialmente un asistente existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del asistente.
   * @param {Response} _res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el asistente.
   * @throws {Error} - Si ocurre un error al actualizar el asistente.
   */
  async patch(_req: Request, _res: Response): Promise<void> {
    const { id } = _req.params;
    const asistente: IAsistente = _req.body;
    try {
      const resultado = await this._repoAsistente.actualizar(
        Number(id),
        asistente
      );
      _res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el asistente con id ${id}:`, error);
      _res.status(500).json({ error: "Error al actualizar el asistente" });
    }
  }

  /**
   * Cambia la contraseña de un asistente y se la envia su correo
   * electronico.
   *
   * @param {Request} req - La peticion HTTP con el cuerpo que contiene
   *                         el email del asistente.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de cambiar la contrase a y enviar el
   *                            correo.
   * @throws {Error} - Si ocurre un error al cambiar la contrase a o
   *                  enviar el correo.
   */

  async cambiarPass(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
      const asistente = await this._repoAsistente.obtenerPorEmail(email);

      if (!asistente) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      const nuevaContraseña = GeneradorAleatorio.generarContraseñaAleatoria(10); //numero de caracteres
      asistente.password = await HasheoService.hashPassword(nuevaContraseña);
      const actualizado = await this._repoAsistente.actualizarContraseña(
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
        `Su nueva contraseña es: ${nuevaContraseña}\n
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
   * Cambia la contraseña de un asistente existente.
   *
   * @param {Request} req - La solicitud HTTP con el cuerpo que contiene
   *                         la nueva contraseña.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de cambiar la contraseña.
   * @throws {Error} - Si ocurre un error al cambiar la contraseña.
   */
  async cambiarContraseña(req: Request, res: Response): Promise<void> {
    const { email, passwordNueva } = req.body;
    try {
      const asistente = await this._repoAsistente.obtenerPorEmail(email);

      if (!asistente) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      asistente.password = await HasheoService.hashPassword(passwordNueva);
      const actualizado = await this._repoAsistente.actualizarContraseña(
        asistente.id,
        asistente.password
      );
      if (!actualizado) {
        res.status(500).json({ message: "Error al actualizar la contraseña." });
        return;
      }

      await this.emailService.enviarCorreo(
        email,
        "Contraseña actualizada",
        `Su contraseña ha sido actualizada exitosamente.\n
        Por su seguridad, asegúrese de recordar su nueva contraseña.`
      );
      res.status(200).json({
        message:
          "Contraseña actualizada y se ha enviado un correo electrónico.",
      });
    } catch (error) {
      console.error("Error al procesar la solicitud de contraseña:", error);
      res.status(500).json({ message: "Error al procesar la solicitud." });
    }
  }
}
export default AsistenteController;
