import type { Request, Response } from "express"
import logger from "../config/logger.config.ts"

export const pingController = async (_req: Request, res: Response) => {
    logger.info("Ping request is received!");
    res.status(200).json({
        message: "pong"
    })
}