import { Redis } from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import { serverConfig } from "./index.ts";

function connectToRedis() {
    try {
        let connection: Redis;

        return () => {
            if(!connection){
                connection = new Redis(serverConfig.REDIS_SERVER_URL);
                return connection;
            }
            return connection;
        }
    } catch (err) {
        console.error("Error in connection to redis", err);
        throw err;
    }
}

export const getRedisConnObject = connectToRedis();


export const redlock = new Redlock([getRedisConnObject()], {
    driftFactor: 0.01,

    retryCount: 10,

    retryDelay: 200, // time in ms

    retryJitter: 200, // time in ms
})