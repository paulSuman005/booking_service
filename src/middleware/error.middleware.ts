import type { Request, Response, NextFunction } from "express";
import { isAppError, type AppError } from "../utils/error/app.error.ts";

export const appErrorHandler = (err: AppError, _req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    if(!isAppError(err)) return next(err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

export const genericErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log(err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
}