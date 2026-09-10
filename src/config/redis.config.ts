import { Redis } from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import { serverConfig } from "./index.ts";

export const redisClient = new Redis(serverConfig.REDIS_SERVER_URL);

export const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,

    retryCount: 10,

    retryDelay: 200, // time in ms

    retryJitter: 200, // time in ms
})