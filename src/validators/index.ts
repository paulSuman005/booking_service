import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject } from "zod";
import logger from "../config/logger.config.ts";


export const validateRequestBody = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating request body!")
            await schema.parseAsync(req.body);
            logger.info("Request body is valid")
            next();
        } catch (err) {
            logger.error("Invalid request body!")
            if (err instanceof ZodError) res.status(400).json({
                message: "Invalid request body",
                success: false,
                err: err.issues[0]
            })
        }
    }
}


export const validateQueryParams = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating query params")
            await schema.parseAsync(req.query);
            logger.info("Query params are valid");
            next();

        } catch (error) {
            logger.info("Invalid query params")
            res.status(400).json({
                message: "Invalid query params",
                success: false,
                error: error
            });
            
        }
    }
}