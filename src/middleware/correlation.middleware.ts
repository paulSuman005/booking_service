import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4} from "uuid"
import { asyncLocalStorage } from "../utils/helpers/request.helper.ts";

export const attachedCorrelatioIdMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    const correlationId = uuidv4();

    asyncLocalStorage.run({correlationId: correlationId}, () => {
        next();
    })
}