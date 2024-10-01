class Rol {
  private _id: number;
  private _nombre: string;

  constructor(id: number, nombre: string) {
    this._id = id;
    this._nombre = nombre;
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
}
