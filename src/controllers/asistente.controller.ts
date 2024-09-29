import { Request, Response } from "express";
import RepoAsistente from "../repository/asistente.repository";

class AsistenteController {
  private readonly _repoAsistente: RepoAsistente;

  /**
   * Constructor de la clase AsistenteController.
   *
   * @param {RepoAsistente} repoAsistente - La instancia del repositorio de asistentes.
   */
  constructor(repoAsistente: RepoAsistente) {
    this._repoAsistente = repoAsistente;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
  }

  /**
   * Obtiene todos los asistentes de la base de datos.
   *
   * @param {Request} _req - La petici n HTTP.
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
    try {
      const asistente = await this._repoAsistente.buscarPorId(Number(id));
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
}

export default AsistenteController;
