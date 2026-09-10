import dotenv from "dotenv";

dotenv.config();

type serverConfig = {
    PORT: number,
    REDIS_SERVER_URL: string,
    LOCK_TTL: number
}

type dbConfig = {
    DB_HOST: string,
    DB_NAME: string,
    DB_PASSWORD: string,
    DB_USER: string
}

export const serverConfig: serverConfig = {
    PORT: Number(process.env.PORT) || 3005,
    REDIS_SERVER_URL: process.env.REDIS_SERVER_URL || "localhost:7500",
    LOCK_TTL: Number(process.env.LOCK_TTL) || 300000
}

export const dbConfig: dbConfig = {
    DB_HOST: process.env.DB_HOST || "localHost",
    DB_NAME: process.env.DB_NAME || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "root",
    DB_USER: process.env.DB_USER || "test_db"
}
