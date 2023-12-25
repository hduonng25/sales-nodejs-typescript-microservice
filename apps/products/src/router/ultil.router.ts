import { NextFunction, Request, Response, Router } from "express";

export const router: Router = Router();

router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    const result = "hduong";
    next(result);
  }
);
