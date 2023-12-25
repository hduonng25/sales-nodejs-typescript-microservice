import { Router } from "express";
import { config } from "~/config";
import { router as UltilsRouter } from "./ultil.router";

export const router: Router = Router();

router.use(`${config.app.prefix}`, UltilsRouter);
