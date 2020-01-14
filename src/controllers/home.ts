import { Request, Response } from "express";
import path from "path";
import logger from "../util/logger";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
  res.sendFile(path.resolve("frontend/build/index.html"));
};
