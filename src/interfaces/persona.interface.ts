interface IPersona {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;

  validarEmail?: (email: string) => boolean;
  getNombreCompleto?: () => string;
}
