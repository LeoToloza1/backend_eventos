import { Request, Response } from "express";
import RepoAsistente from "../repository/asistente.repository";

class AsistenteController {
  private readonly _repoAsistente: RepoAsistente;

  constructor(repoAsistente: RepoAsistente) {
    this._repoAsistente = repoAsistente;
    this.getAll = this.getAll.bind(this);
    this.getId = this.getId.bind(this);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const asistentes = await this._repoAsistente.obtenerTodos();
      res.json(asistentes);
    } catch (error) {
      console.error("Error al obtener asistentes:", error);
      res.status(500).json({ error: "Error al obtener asistentes" });
    }
  }

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

  async post(_req: Request, _res: Response): Promise<void> {
    // Implementa la lógica para crear un nuevo asistente
  }

  async put(_req: Request, _res: Response): Promise<void> {
    // Implementa la lógica para actualizar un asistente
  }

  async patch(_req: Request, _res: Response): Promise<void> {
    // Implementa la lógica para actualizar parcialmente un asistente
  }
}

export default AsistenteController;
