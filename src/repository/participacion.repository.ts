import Conectar from "../db/config_db";
class RepoParticipacion
  implements ICrud<IParticipacion>, IMapeo<IParticipacion>
{
  constructor(private readonly db: Conectar) {}

  async obtenerTodos(): Promise<IParticipacion[]> {
    try {
      const sql = `
      SELECT 
        p.id, p.confirmacion, p.asistencia_real, 
        a.id AS asistente_id, a.nombre AS asistente_nombre, 
        a.apellido AS asistente_apellido, a.email AS asistente_email,
        a.telefono AS asistente_telefono, a.dni AS asistente_dni, 
        e.id AS evento_id, e.nombre AS evento_nombre,
        e.ubicacion AS evento_ubicacion, e.fecha AS evento_fecha,
        e.descripcion AS evento_descripcion, e.realizado AS evento_realizado
      FROM participacion p
      JOIN asistentes a ON p.asistente_id = a.id
      JOIN eventos e ON p.evento_id = e.id
    `;
      const resultados = await this.db.consultar(sql);
      return this.mapearResultados(resultados);
    } catch (error) {
      console.error("Error al obtener todos los participaciones:", error);
      throw new Error("Error al obtener todos los participaciones");
    }
  }
  async buscarPorId(id: number): Promise<IParticipacion | null> {
    try {
      const sql = `SELECT 
        p.id, p.confirmacion, p.asistencia_real, 
        a.id AS asistente_id, a.nombre AS asistente_nombre, 
        a.apellido AS asistente_apellido, a.email AS asistente_email,
        a.telefono AS asistente_telefono, a.dni AS asistente_dni, 
        e.id AS evento_id, e.nombre AS evento_nombre,
        e.ubicacion AS evento_ubicacion, e.fecha AS evento_fecha,
        e.descripcion AS evento_descripcion, e.realizado AS evento_realizado
      FROM participacion p
      JOIN asistentes a ON p.asistente_id = a.id
      JOIN eventos e ON p.evento_id = e.id WHERE p.id = ?`;
      const resultados = await this.db.consultar(sql, [id]);
      if (resultados.length === 0) {
        return null;
      }
      return this.mapearResultados(resultados)[0];
    } catch (error) {
      console.error(`Error al buscar el evento con id ${id}:`, error);
      throw new Error("Error al buscar por id un evento");
    }
  }

  async crear(item: IParticipacion): Promise<IParticipacion | null> {
    try {
      const sql =
        "INSERT INTO participacion (asistente_id, evento_id, confirmacion, asistencia_real) VALUES (?, ?, ?, ?)";
      const { asistente_id, evento_id, confirmacion, asistencia_real } = item;
      await this.db.consultar(sql, [
        asistente_id,
        evento_id,
        confirmacion,
        asistencia_real,
      ]);
      return item;
    } catch (error) {
      console.error("Error al crear el evento:", error);
      return null;
    }
  }

  async actualizar(
    id: number,
    item: IParticipacion
  ): Promise<boolean | IParticipacion> {
    try {
      const campos = Object.keys(item)
        .filter((key) => item[key as keyof IParticipacion] !== undefined)
        .map((key) => `${key} = ?`);
      const valores = Object.values(item).filter(
        (valor) => valor !== undefined
      );

      if (campos.length === 0) {
        throw new Error("No hay campos para actualizar");
      }
      const sql = `UPDATE participacion SET ${campos.join(", ")} WHERE id = ?`;
      await this.db.consultar(sql, [...valores, id]);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el evento con id ${id}:`, error);
      return false;
    }
  }

  mapearResultados(resultados: any[]): IParticipacion[] {
    console.log(resultados);
    return resultados.map((resultado) => ({
      id: resultado.id,
      confirmacion: resultado.confirmacion,
      asistencia_real: resultado.asistencia_real,
      asistente_id: resultado.asistente_id,
      evento_id: resultado.evento_id,
      asistente: {
        id: resultado.asistente_id,
        nombre: resultado.asistente_nombre,
        apellido: resultado.asistente_apellido,
        email: resultado.asistente_email,
        telefono: resultado.asistente_telefono,
        dni: resultado.asistente_dni,
      },
      evento: {
        id: resultado.evento_id,
        nombre: resultado.evento_nombre,
        ubicacion: resultado.evento_ubicacion,
        fecha: resultado.evento_fecha,
        descripcion: resultado.evento_descripcion,
        realizado: resultado.evento_realizado,
      },
    }));
  }
}
export default RepoParticipacion;
