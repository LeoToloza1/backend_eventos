class Evento {
  private _id: number;
  private _nombre: string;
  private _ubicacion: string;
  private _fecha: Date;
  private _descripcion: string;
  private _realizado: boolean;

  /**
   * Constructor de la clase Evento.
   *
   * @param {number} id - El id del evento.
   * @param {string} nombre - El nombre del evento.
   * @param {string} ubicacion - La ubicacion del evento.
   * @param {Date} fecha - La fecha del evento.
   * @param {string} descripcion - La descripcion del evento.
   * @param {boolean} [realizado=false] - Si el evento ya ha sido realizado.
   */
  constructor(
    id: number,
    nombre: string,
    ubicacion: string,
    fecha: Date,
    descripcion: string,
    realizado: boolean
  ) {
    this._id = id;
    this._nombre = nombre;
    this._ubicacion = ubicacion;
    this._fecha = fecha;
    this._descripcion = descripcion;
    this._realizado = realizado;
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get nombre(): string {
    return this._nombre;
  }
  get ubicacion(): string {
    return this._ubicacion;
  }
  get fecha(): Date {
    return this._fecha;
  }
  get descripcion(): string {
    return this._descripcion;
  }
  get realizado(): boolean {
    return this._realizado;
  }

  // Setters
  set id(id: number) {
    this._id = id;
  }
  set nombre(nombre: string) {
    this._nombre = nombre;
  }
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }
  set fecha(fecha: Date) {
    this._fecha = fecha;
  }
  set descripcion(descripcion: string) {
    this._descripcion = descripcion;
  }
  set realizado(realizado: boolean) {
    this._realizado = realizado;
  }
}
