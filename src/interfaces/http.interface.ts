interface IMetodosHttp<T> {
  getAll: (req: Request, res: Response) => Promise<Response[]>;
  getId: (req: Request, res: Response) => Promise<T | null>;
  post: (req: Request, res: Response) => Promise<T>;
  put: (req: Request, res: Response) => Promise<T | null>;
  patch: (req: Request, res: Response) => Promise<T | null>;
}
