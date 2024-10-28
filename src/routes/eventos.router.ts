import { Router } from "express";
import EventoController from "../controllers/evento.controller";

class EventosRouter {
  private router = Router();
  private readonly eventoController: EventoController;

  constructor(eventoControler: EventoController) {
    this.eventoController = eventoControler;
    this.configurarRutas();
  }
  private configurarRutas(): void {
    this.router.get("/", this.eventoController.getAll);
    this.router.get("/activos", this.eventoController.getAllActive);
    this.router.get("/:id", this.eventoController.getId);
    this.router.post("/crear", this.eventoController.post);
    this.router.put("/actualizar/:id", this.eventoController.put);
    this.router.patch("/parcial/:id", this.eventoController.patch);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default EventosRouter;
