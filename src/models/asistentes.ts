class Asistente extends Persona {
  private _id: number;
  private _nombre: string;
  private _apellido: string;
  private _email: string;
  private _telefono: number;
  private _dni: number;

  /**
   * Constructor de la clase Asistente.
   *
   * @param {number} id - El id del asistente.
   * @param {string} nombre - El nombre del asistente.
   * @param {string} apellido - El apellido del asistente.
   * @param {string} email - El email del asistente.
   * @param {number} telefono - El telefono del asistente.
   * @param {number} dni - El dni del asistente.
   */
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    telefono: number,
    dni: number
  ) {
    super();
    this._id = id;
    this._nombre = nombre;
    this._apellido = apellido;
    this._email = email;
    this._telefono = telefono;
    this._dni = dni;
  }

  get id(): number {
    return this._id;
  }
  set id(id: number) {
    this._id = id;
  }

  public get nombre(): string {
    return this._nombre;
  }
  public set nombre(value: string) {
    this._nombre = value;
  }
  get apellido(): string {
    return this._apellido;
  }
  set apellido(value: string) {
    this._apellido = value;
  }
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }
  get telefono(): number {
    return this._telefono;
  }
  set telefono(value: number) {
    this._telefono = value;
  }
  get dni(): number {
    return this._dni;
  }
  set dni(value: number) {
    this._dni = value;
  }
  getNombreCompleto(): string {
    return `${this._nombre} ${this._apellido}`;
  }
}
