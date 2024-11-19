export interface IAsistenteEvento {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  dni: number;
  confirmacion: boolean;
  asistencia_real: boolean | null;
}

export interface IEventoConAsistentes {
  id: number;
  evento_id: number;
  nombre: string;
  ubicacion: string;
  fecha: Date;
  descripcion: string;
  realizado: boolean;
  asistentes: IAsistenteEvento[];
}
