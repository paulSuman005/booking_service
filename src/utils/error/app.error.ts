export interface AppError extends Error {
    statusCode: number;
}

export class InternalServerError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 500;
        this.message = message;
        this.name = "INTERNAL_SERVER_ERROR"
    }
}

export class NotFoundError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 404;
        this.message = message;
        this.name = "NOT_FOUND_ERROR"
    }
}

export class UnAuthorizedError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 401;
        this.message = message;
        this.name = "UNAUTHORIZED_ERROR"
    }
}

export class ForbiddenError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 403;
        this.message = message;
        this.name = "FORBIDDEN_ERROR"
    }
}

export class CustomAppError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string, statusCode?: number){
        this.statusCode = statusCode || 400;
        this.message = message;
        this.name = "FORBIDDEN_ERROR"
    }
}

export class ValidationError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 400;
        this.message = message;
        this.name = "VALIDATION_ERROR"
    }
}

export class ConflictError implements AppError {
    statusCode: number;
    message: string;
    name: string;
    
    constructor(message: string){
        this.statusCode = 409;
        this.message = message;
        this.name = "CONFLICT_ERROR"
    }
}

