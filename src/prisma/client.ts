import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/client.ts";
import { dbConfig } from "../config/index.ts";

const adapter = new PrismaMariaDb({
  host: dbConfig.DB_HOST,
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
  database: dbConfig.DB_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };