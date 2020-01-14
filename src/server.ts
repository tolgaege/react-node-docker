import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import logger from "./util/logger";
import Database from "./database/Database";
import Cache from "./cache/Cache";
import https from "https";
import * as fs from "fs";
import * as path from "path";

const beforeServerStart = () => {
  logger.info(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);

  Promise.all([
    Cache.init(),
    Database.init(),
  ]).then(() => {
    logger.info("✅ All integrations loaded");
  });
};

let options = {};
let server: any;
if (process.env.NODE_ENV === "production") {
  options = {
    cert: fs.readFileSync("/etc/letsencrypt/live/usehaystack.io/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/usehaystack.io/privkey.pem"),
  };

  server = https.createServer(options, app).listen(app.get("port"), beforeServerStart);
}

if (process.env.NODE_ENV === "development") {
  server = app.listen(app.get("port"), beforeServerStart);
}

function cleanup(signal: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    logger.info(`Called signal: ${signal}`);

    try {
      await Database.shutdown();
      await Cache.shutdown();
    } catch (e) {
      logger.error(`Error on graceful shutdown: ${e}`);
    }

    logger.info("Server shut down.....");
    resolve();
  });
}

gracefulShutdown(server, {
  signals: "SIGINT SIGTERM",
  timeout: 50000,
  onShutdown: cleanup,
});

export default server;
