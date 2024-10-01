interface IParticipacion {
  id: number;
  asistente_id: number;
  evento_id: number;
  confirmacion: boolean;
  asistencia_real?: boolean;
}
