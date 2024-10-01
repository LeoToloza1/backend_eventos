import { Request, Response } from "express";
import RepoParticipacion from "../repository/participacion.repository";

class ParticipacionController {
  private readonly _repoParticipacion: RepoParticipacion;

  /**
   * Constructor de la clase ParticipacionController.
   *
   * @param {RepoParticipacion} RepoParticipacion - La instancia del repositorio de participaciones.
   */
  constructor(RepoParticipacion: RepoParticipacion) {
    this._repoParticipacion = RepoParticipacion;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
  }

  /**
   * Obtiene todos las participaciones de la base de datos.
   *
   * @param {Request} _req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener las participaciones.
   * @throws {Error} - Si ocurre un error al obtenerlas participaciones.
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const participacion = await this._repoParticipacion.obtenerTodos();
      res.json(participacion);
    } catch (error) {
      console.error("Error al obtener las participaciones:", error);
      res.status(500).json({ error: "Error al obtener las participaciones" });
    }
  }

  /**
   * Obtiene una participacion por su id.
   *
   * @param {Request} req - La peticion HTTP.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de obtener las participaciones.
   * @throws {Error} - Si ocurre un error al obtener las participaciones.
   */
  async getId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const participacion = await this._repoParticipacion.buscarPorId(
        Number(id)
      );
      if (participacion === null) {
        res.status(404).json({
          error: "No se encuentra la participacion, intente de nuevo",
        });
        return;
      }

      res.json(participacion);
    } catch (error) {
      console.error(`Error al obtener la participacion con id ${id}:`, error);
      res.status(500).json({ error: "Error al obtener la participacion" });
    }
  }

  /**
   * Crea una nueva participacion en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el cuerpo que contiene
   *                         los datos de la nuevo participacion.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de crear la participacion.
   * @throws {Error} - Si ocurre un error al crear la participacion.
   */
  async post(_req: Request, res: Response): Promise<void> {
    try {
      const participacion: IParticipacion = _req.body;
      const resultado = await this._repoParticipacion.crear(participacion);
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
    const participacion: IParticipacion = _req.body;
    try {
      const resultado = await this._repoParticipacion.actualizar(
        Number(id),
        participacion
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
    const participacion: IParticipacion = _req.body;
    try {
      const resultado = await this._repoParticipacion.actualizar(
        Number(id),
        participacion
      );
      _res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el asistente con id ${id}:`, error);
      _res.status(500).json({ error: "Error al actualizar el asistente" });
    }
  }
}

export default ParticipacionController;
