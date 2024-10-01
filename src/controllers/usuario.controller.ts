import { Request, Response } from "express";
import RepoUsuario from "../repository/usuario.repository";

class UsuarioController {
  private readonly _repoUsuario: RepoUsuario;

  /**
   * Constructor de la clase UsuarioController.
   *
   * @param {RepoUsuario} repoUsuario - La instancia del repositorio de usuarios.
   */
  constructor(repoUsuario: RepoUsuario) {
    this._repoUsuario = repoUsuario;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
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
    const { id } = req.params;
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
    const { id } = _req.params;
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
    const { id } = _req.params;

    const usuario: IUsuario = _req.body;
    try {
      const resultado = await this._repoUsuario.actualizar(Number(id), usuario);
      _res.json(resultado);
    } catch (error) {
      console.error(`Error al actualizar el usuario con id ${id}:`, error);
      _res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }
}

export default UsuarioController;
