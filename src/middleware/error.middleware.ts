import type { Request, Response, NextFunction } from "express";
import type { AppError } from "../utils/error/app.error.ts";



export const genericErrorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.log(err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}