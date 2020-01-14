import { CronJob } from "cron";

import logger from "../util/logger";
import * as gitController from "./git";
import * as apiController from "./api";

// Scheduled Jobs
export const activateCronJobs = () => {
	if (process.env.NODE_ENV === "production") {
	  // Run every day at 12:00 PST (Los Angeles Time)
	  const refreshJob = new CronJob("00 00 21 * * *", function() {
	    logger.info("Kicking off Refresh");
	    gitController.refreshAll();
	    logger.info("Refresh Completed");
	  }, null, true, "America/Los_Angeles");

	  // Healthcheck Every 5 minutes
	  const healthCheckJob = new CronJob("* 05 * * * *", function() {
	    logger.info("Healthcheck");
	    apiController.healthCheck();
	    logger.info("Healthcheck Completed");
	  }, null, true, "America/Los_Angeles");
	}
};
