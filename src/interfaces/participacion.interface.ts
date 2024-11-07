interface IParticipacion {
  id: number;
  evento_id?: number;
  asistente_id?: number;
  asistente: IPersona;
  evento: IEventos;
  confirmacion: boolean;
  asistencia_real?: boolean;
}
