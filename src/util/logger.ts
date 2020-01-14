import winston, { createLogger, format, transports } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";

import * as fs from "fs";
import * as path from "path";

const logDir = process.env.LOG_DIR || "logs";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, "debug.log");
const dailyRotateFileTransport = new dailyRotateFile({
  filename: `${logDir}/%DATE%-debug.log`,
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.printf(
      (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
    ),
  ),
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
        ),
      ),
    }),
    dailyRotateFileTransport,
  ],
});

export default logger;
