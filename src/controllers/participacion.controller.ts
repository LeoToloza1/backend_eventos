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
    this.post = this.post.bind(this); //usuario asistente
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.asistenciaReal = this.asistenciaReal.bind(this); //router para usuario
    this.confirmarAsistencia = this.confirmarAsistencia.bind(this); //router para asistente
    this.partipacionPorEvento = this.partipacionPorEvento.bind(this);
    this.eventosPorAsistente = this.eventosPorAsistente.bind(this);
    this.eventosSinConfirmar = this.eventosSinConfirmar.bind(this);
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
      const participacion = _req.body;
      console.log("BODY PARTICIPACION", _req.body);
      const asistente = _req.user?.userId;
      console.log("ASISTENTE", asistente);
      const resultado = await this._repoParticipacion.crear(
        participacion,
        Number(asistente)
      );
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

  /**
   * Marca una participacion como realizada en la base de datos.
   *
   * @param {Request} _req - La peticion HTTP con el id de la participacion.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            termina de marcar la participacion como realizada.
   * @throws {Error} - Si ocurre un error al marcar la participacion como realizada.
   */
  async asistenciaReal(_req: Request, res: Response): Promise<void> {
    const { id } = _req.params;
    try {
      const resultado = await this._repoParticipacion.asistenciaReal(
        Number(id)
      );
      const responseMessage = resultado
        ? { msj: "Asistencia marcada correctamente!" }
        : { msj: "No se pudo marcar la asistencia como realizada" };
      res.json(responseMessage);
    } catch (error) {
      console.error(`Error al marcar la participacion con id ${id}:`, error);
      res.status(500).json({ error: "Error al marcar la participacion" });
    }
  }

  /**
   * Confirma la asistencia de un asistente en una participacion.
   *
   * @param {Request} _req - La peticion HTTP que contiene el usuario que se va a confirmar.
   * @param {Response} res - La respuesta HTTP.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se termina de
   *                            confirmar la asistencia.
   * @throws {Error} - Si ocurre un error al confirmar la asistencia.
   */
  async confirmarAsistencia(_req: Request, res: Response): Promise<void> {
    const id = _req.user?.userId;
    try {
      const resultado = await this._repoParticipacion.confirmarAsistencia(
        Number(id)
      );
      const responseMessage = resultado
        ? { msj: "Asistencia confirmada correctamente!" }
        : { msj: "No se pudo confirmar la asistencia" };
      res.json(responseMessage);
    } catch (error) {
      console.error(`Error al confirmar la asistencia con id ${id}:`, error);
      res.status(500).json({ error: "Error al confirmar la asistencia" });
    }
  }

  /**
   * Busca las participaciones de un evento por su nombre y devuelve los resultados.
   *
   * @param {Request} req - La petición HTTP que contiene el nombre del evento a buscar en la consulta.
   * @param {Response} res - La respuesta HTTP que contiene las participaciones encontradas o un error.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se completa la operación de búsqueda.
   * @throws {Error} - Si ocurre un error al obtener las participaciones del evento especificado.
   */
  async partipacionPorEvento(req: Request, res: Response) {
    const nombre: string = req.query.nombre as string;
    console.log("Llega del request: " + nombre);
    try {
      const nombreValid = nombre.trim();
      if (!nombreValid) {
        res.status(400).json({ error: "El nombre no puede estar vacío" });
        return;
      }
      const evento = await this._repoParticipacion.buscarPorEvento(nombreValid);
      if (!evento) {
        res.status(404).json({ error: "No se encuentra el evento" });
        return;
      }
      res.json(evento);
    } catch (error) {
      console.error(`Error al obtener el evento con nombre: ${nombre}:`, error);
      res.status(500).json({ error: "Error al obtener el evento" });
    }
  }

  /**
   * Obtiene las participaciones de un asistente por su id.
   *
   * @param {Request} req - La petición HTTP que contiene el id del asistente.
   * @param {Response} res - La respuesta HTTP que contiene las participaciones
   *                         encontradas o un error.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se completa la
   *                            operación de búsqueda.
   * @throws {Error} - Si ocurre un error al obtener las participaciones del
   *                  asistente.
   */
  async eventosPorAsistente(req: Request, res: Response) {
    try {
      const id = req.user?.userId;

      const eventosPorAsistente =
        await this._repoParticipacion.obtenerPorAsistente(Number(id));

      if (eventosPorAsistente.length === 0) {
        res
          .status(404)
          .json({ error: "No se encontraron eventos para el asistente" });
        return;
      }
      res.status(200).json(eventosPorAsistente);
    } catch (error) {
      console.error(
        `Error al obtener las participaciones del asistente con id ${req.user?.userId}:`,
        error
      );
      res
        .status(500)
        .json({ error: "Error al obtener las participaciones del asistente" });
    }
  }

  /**
   * Obtiene los eventos que no han sido confirmados por el asistente
   * con el id especificado.
   *
   * @param {Request} req - La petición HTTP que contiene el id del
   *                        asistente.
   * @param {Response} res - La respuesta HTTP que contiene los eventos
   *                         encontrados o un error.
   * @returns {Promise<void>} - La promesa que se resuelve cuando se
   *                            completa la operación de búsqueda.
   * @throws {Error} - Si ocurre un error al obtener los eventos sin
   *                  confirmar del asistente.
   */
  async eventosSinConfirmar(req: Request, res: Response) {
    try {
      const id = req.user?.userId;
      console.log("IDE DEL USUARIO: " + id);
      const eventosSinConfirmar =
        await this._repoParticipacion.eventosSinCnfirmar(Number(id));
      eventosSinConfirmar.forEach((item) => {
        console.log("Eventos sin confirmar: " + item);
      });
      res.status(200).json(eventosSinConfirmar);
    } catch (error) {
      console.error(`error al listar los eventos sin confirmar `);
      res
        .status(500)
        .json({ error: "Error al listar los eventos sin confirmar" });
    }
  }
}

export default ParticipacionController;
