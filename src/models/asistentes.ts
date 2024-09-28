class Asistente implements IAsistente {
  public readonly id: number;
  public nombre: string;
  public apellido: string;
  public email: string;
  public telefono: number;
  public dni: number;

  /**
   * Crea un objeto Asistente con los datos proporcionados.
   *
   * @param {number} id - El id del asistente.
   * @param {string} nombre - El nombre del asistente.
   * @param {string} apellido - El apellido del asistente.
   * @param {string} email - El email del asistente.
   * @param {number} telefono - El tel fono del asistente.
   * @param {number} dni - El DNI del asistente.
   * @throws {Error} - Si el email no es v lido.
   */
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    telefono: number,
    dni: number
  ) {
    if (!this.validarEmail(email)) {
      throw new Error("El email no es válido");
    }
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
    this.dni = dni;
  }

  /**
   * Valida si el email es v lido.
   *
   * @param {string} email - El email a validar.
   * @returns {boolean} - `true` si el email es v lido, `false` en caso contrario.
   */
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Obtiene el nombre completo del asistente.
   *
   * @returns {string} - El nombre completo del asistente.
   */
  getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }
}
