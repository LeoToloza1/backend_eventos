import { Request, Response } from "express";
import RepoEvento from "../repository/evento.repository";

class EventoController {
  private readonly _repoEvento: RepoEvento;
  constructor(repo: RepoEvento) {
    this._repoEvento = repo;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
  }

  /**
   * Obtiene todos los eventos de la base de datos.
   *
   * @param {Request} _req - La peticion HTTP.
   * @param {Response} _res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener los eventos.
   * @throws {Error} - Si ocurre un error al obtener los eventos.
   */
  async getAll(_req: Request, _res: Response): Promise<void> {
    try {
      const eventos = await this._repoEvento.obtenerTodos();
      _res.json(eventos);
    } catch (error) {
      console.log(error);
      _res.status(500).json({ error: "Error al obtener los eventos" });
    }
  }
  async getAllActive(_req: Request, _res: Response): Promise<void> {
    try {
      const eventos = await this._repoEvento.obtenerActivos();
      _res.json(eventos);
    } catch (error) {
      console.log(error);
      _res.status(500).json({ error: "Error al obtener los eventos" });
    }
  }

  /**
   * Obtiene un evento por su id.
   *
   * @param {Request} req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener el evento.
   * @throws {Error} - Si ocurre un error al obtener el evento.
   */
  async getId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const evento = await this._repoEvento.buscarPorId(Number(id));
      if (evento === null) {
        res.status(404).json({ error: "No se encuentra el evento" });
        return;
      }
      res.json(evento);
    } catch (error) {
      console.error(`Error al obtener el evento con id ${id}:`, error);
      res.status(500).json({ error: "Ocurrió al obtener el evento" });
    }
  }

  /**
   * Crea un nuevo evento en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos del nuevo evento.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de crear el evento.
   * @throws {Error} - Si ocurre un error al crear el evento.
   */
  async post(_req: Request, res: Response): Promise<void> {
    try {
      const evento: IEventos = _req.body;
      const resultado = await this._repoEvento.crear(evento);
      res.json(resultado);
    } catch (error) {
      console.error("Error al crear el evento:", error);
      res.status(500).json({ error: "Error al crear el evento" });
    }
  }

  /**
   * Actualiza un evento existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del evento.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el evento.
   * @throws {Error} - Si ocurre un error al actualizar el evento.
   */
  async put(_req: Request, res: Response): Promise<void> {
    const { id } = _req.params;
    const evento: IEventos = _req.body;
    try {
      const resultado = await this._repoEvento.actualizar(Number(id), evento);
      res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el evento con id ${id}:`, error);
      res.status(500).json({ error: "Error al actualizar el evento" });
    }
  }

  /**
   * Actualiza parcialmente un evento existente en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos actualizados del evento.
   * @param {Response} _res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de actualizar el evento.
   * @throws {Error} - Si ocurre un error al actualizar el evento.
   */

  async patch(_req: Request, _res: Response): Promise<void> {
    const { id } = _req.params;
    const evento: IEventos = _req.body;
    try {
      const resultado = await this._repoEvento.actualizar(Number(id), evento);
      _res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el evento con id ${id}:`, error);
      _res.status(500).json({ error: "Error al actualizar el evento" });
    }
  }
}
export default EventoController;
