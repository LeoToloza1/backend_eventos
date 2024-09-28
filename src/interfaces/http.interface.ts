interface IMetodosHttp<T> {
  getAll: (url: string, params?: any) => Promise<T[]>;
  getId: (url: string, params?: any) => Promise<T | null>;
  post: (url: string, params?: any) => Promise<T>;
  put: (url: string, params: any) => Promise<T | null>;
  patch: (url: string, params: any) => Promise<T | null>;
}
