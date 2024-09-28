import Conectar from "../db/config_db";
import { Request, Response } from "express";
import RepoAsistente from "../repository/asistente.repository";
class AsistenteController {
  private readonly db = Conectar.obtenerInstancia();
  private readonly _repoAsistente = new RepoAsistente(this.db);

  constructor() {}
  async obtenerTodos(_req: Request, res: Response) {
    const asistentes = await this._repoAsistente.obtenerTodos();
    res.json(asistentes);
  }
}
export default AsistenteController;
