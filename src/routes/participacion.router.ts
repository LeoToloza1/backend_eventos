import { Router } from "express";
import ParticipacionController from "../controllers/participacion.controller";

class ParticipacionRouter {
  private router = Router();
  private readonly participacionController: ParticipacionController;

  constructor(participacionController: ParticipacionController) {
    this.participacionController = participacionController;
    this.configurarRutas();
  }
  private configurarRutas(): void {
    this.router.get("/", this.participacionController.getAll);
    this.router.get("/:id", this.participacionController.getId);
    this.router.post("/crear", this.participacionController.post);
    this.router.put("/actualizar/:id", this.participacionController.put);
    this.router.patch("/parcial/:id", this.participacionController.patch);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default ParticipacionRouter;
