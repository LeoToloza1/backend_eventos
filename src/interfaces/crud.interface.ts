interface ICrud<T> {
  obtenerTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | null>;
  crear(item: T): Promise<T | null>;
  actualizar(id: number, item: T): Promise<T | boolean>;
}
