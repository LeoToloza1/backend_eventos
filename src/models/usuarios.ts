class Usuario extends Persona {
  private _id: number;
  private _nombre: string;
  private _apellido: string;
  private _email: string;
  private _telefono: number;
  private _dni: number;
  private _password: string;
  private _rol_id: number;
  private _rol: Rol;

  /**
   * Constructor de la clase Usuario.
   *
   * @param {number} id - El id del usuario.
   * @param {string} nombre - El nombre del usuario.
   * @param {string} apellido - El apellido del usuario.
   * @param {number} telefono - El telefono del usuario.
   * @param {number} dni - El dni del usuario.
   * @param {string} password - La password del usuario.
   * @param {number} rol_id - El id del rol del usuario.
   */

  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    telefono: number,
    dni: number,
    password: string,
    rol_id: number,
    rol: Rol
  ) {
    super();
    this._id = id;
    this._nombre = nombre;
    this._apellido = apellido;
    this._email = email;
    this._telefono = telefono;
    this._dni = dni;
    this._password = password;
    this._rol_id = rol_id;
    this._rol = rol;
  }

  // Getters y setters
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

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get rol_id(): number {
    return this._rol_id;
  }

  set rol_id(value: number) {
    this._rol_id = value;
  }

  get rol(): Rol {
    return this._rol;
  }
  set rol(value: Rol) {
    this._rol = value;
  }
  public getNombreCompleto(): string {
    return `${this._nombre} ${this._apellido}`;
  }
}
