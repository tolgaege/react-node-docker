import asyncRedis from "async-redis";
import { Response, Request, NextFunction } from "express";
import logger from "../util/logger";

const redis = require("redis");


// This is a hack to make express Redis work since it should be declared and connected
// in app.ts rather than server.ts
const expressRedisCache = require("express-redis-cache");
let expressCache = new expressRedisCache({
  client: redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    password: process.env.REDIS_PASSWORD
  }),
  prefix: "expressRoute",
  // expire: 24 * 60 * 60, // 24 hours. <- Removed. Cache always lives!!  Until the next scheduled update anyways...
});

expressCache.on("error", function (error: any) {
  logger.error(`ExpressRedis: ${error}`);
});

expressCache.on("message", function(message: any){
  logger.info(`ExpressRedis: ${message}`);
});

export default class Cache {
    static client: any
    static expressCache: any

    static init(): Promise<any> {
      if (Cache.client) {
        logger.error("Client already exists");
        return new Promise((resolve, reject) => { reject(); });
      }
        
      const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
        password: process.env.REDIS_PASSWORD
      });

      // Allows redis to be used with promises (async, await)
      // TODO: https://github.com/NodeRedis/node_redis#promises
      Cache.client = asyncRedis.decorate(client);

      expressCache = new expressRedisCache({
        client: Cache.client,
        prefix: "expressRoute",
        // expire: 24 * 60 * 60, // 24 hours. <- Removed. Cache always lives!!  Until the next scheduled update anyways...
      });

      return new Promise((resolve, reject) => {
        Cache.client.on("connect", () => {
          logger.info("✅ Redis: Connection Succeeded");
          resolve();
        });
        Cache.client.on("error", (e: any) => {
          logger.error(`❌ Redis: Connection Failed:${e}`);
          reject();
        });
      });
    }

    static shutdown(): Promise<any> {
      logger.info("Redis: Shutting down..");
      return Cache.client.quit();
    }

    static async set(...args: any[]) {
      return this.client.set(...args);
    }

    static async get(...args: any[]) {
      return Cache.client.get(...args);
    }

    static async del(...args: any[]) {
      return this.client.del(...args);
    }

    static async quit() {
      return this.client.quit();
    }

    static async flushdb() {
      return Cache.client.flushdb();
    }

    static route(): any {
      return expressCache.route();
    }
}
