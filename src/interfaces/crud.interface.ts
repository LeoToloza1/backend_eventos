interface ICrud<T> {
  obtenerTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | boolean>;
  crear(item: T): Promise<T | boolean>;
  actualizar(id: number, item: T): Promise<T | boolean>;
}
