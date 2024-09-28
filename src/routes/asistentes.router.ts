import { Router } from "express";
import AsistenteController from "../controllers/asistente.controller";

class AsistenteRouter {
  private router = Router();
  private readonly asistenteController = new AsistenteController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      this.asistenteController.obtenerTodos.bind(this.asistenteController)
    );
    // this.router.get("/asistentes/:id", this.getId.bind(this));
    // this.router.post("/asistentes", this.post.bind(this));
    // this.router.put("/asistentes/:id", this.put.bind(this));
    // this.router.patch("/asistentes/:id", this.patch.bind(this));
  }

  public getRouter() {
    return this.router;
  }
}

export default AsistenteRouter;
