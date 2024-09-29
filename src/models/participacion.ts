/**
 * uso del principio LPS (principio de sustitución de Liskov)
 * para la clase persona
 */

class Participacion {
  private _id: number;
  private _asistente: Persona;
  private _evento: Evento;
  private _confirmacion: boolean;
  private _asistencia_real: boolean;

  constructor(
    id: number,
    asistente: Persona,
    evento: Evento,
    confirmacion: boolean,
    asistencia_real: boolean
  ) {
    this._id = id;
    this._asistente = asistente;
    this._evento = evento;
    this._confirmacion = confirmacion;
    this._asistencia_real = asistencia_real;
  }

  // Getters

  get id(): number {
    return this._id;
  }

  get asistente(): Persona {
    return this._asistente;
  }

  get evento(): Evento {
    return this._evento;
  }

  get confirmacion(): boolean {
    return this._confirmacion;
  }

  get asistencia_real(): boolean {
    return this._asistencia_real;
  }

  // Setters

  set asistencia_real(asistencia_real: boolean) {
    this._asistencia_real = asistencia_real;
  }

  set confirmacion(confirmacion: boolean) {
    this._confirmacion = confirmacion;
  }

  set asistente(asistente: Persona) {
    this._asistente = asistente;
  }

  set evento(evento: Evento) {
    this._evento = evento;
  }

  set id(id: number) {
    this._id = id;
  }
}
