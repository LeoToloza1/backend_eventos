// types/express/index.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userEmail: string;
        userName: string;
        role: string;
      };
    }
  }
}
