interface ICrud<T> {
  obtenerTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | null>;
  crear(item: T): Promise<boolean>;
  actualizar(id: number, item: T): Promise<boolean>;
}
