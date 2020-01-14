import express, { Request, Response, NextFunction } from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import bluebird from "bluebird";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "errorhandler";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import * as path from "path";

import { generateToken, sendToken } from "./util/token";
import Cache from "./cache/Cache";
import * as homeController from "./controllers/home";
import * as apiController from "./controllers/api";
import * as analyticController from "./controllers/analytic";
import * as gitController from "./controllers/git";
import { activateCronJobs } from "./controllers/cron";
// import * as contactController from "./controllers/contact";
// import * as userController from "./controllers/user";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend")));
  app.use(express.static(path.resolve(__dirname, "../frontend", "build")));
}

// Provides all of the stack info of the error
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

// Allows the server not to crash if you forget a try catch. Basically adds try catch to all requests
const asyncMiddleware = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"]
};
app.use(cors(corsOption));
app.use("/api/", apiLimiter);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: Cache.client,
}));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(helmet());

// Primary app routes.
app.get("/", homeController.index);

// API examples routes.
app.get("/api", apiController.getApi);
app.get("/api/test", apiController.testApi);
// app.get("/api/testgit", apiController.testGit);

// Analytic
app.get("/api/analytic/cycle_time", Cache.route(), analyticController.cycleTime);
app.get("/api/analytic/throughput", Cache.route(), analyticController.throughput);
app.get("/api/analytic/activity_heatmap", Cache.route(), analyticController.activityHeatmap);
app.get("/api/analytic/sprint_report", Cache.route(), analyticController.sprintReport);
app.get("/api/analytic/refresh_cache", asyncMiddleware(analyticController.triggerRefreshCache));


// GitHub Integration app routes
app.get("/api/git/refresh_all", asyncMiddleware(gitController.refreshAll));
app.get("/api/git/prepdb", asyncMiddleware(gitController.prepdb));
app.get("/api/git/org", asyncMiddleware(gitController.triggerStoreOrgInfo)); // params: username, organizationKey
app.get("/api/git/org/repos", asyncMiddleware(gitController.triggerStoreOrgRepos)); // params: username
app.get("/api/git/org/teams", asyncMiddleware(gitController.triggerStoreOrgTeams)); // params: username
app.get("/api/git/org/team/members", asyncMiddleware(gitController.triggerStoreOrgTeamMembers)); // params: username
app.get("/api/git/org/team/repos", asyncMiddleware(gitController.triggerStoreTeamRepositories)); // params: username
app.get("/api/git/org/members", asyncMiddleware(gitController.triggerStoreOrgMembers)); // params: username
app.get("/api/git/repo/pull_requests", asyncMiddleware(gitController.triggerStoreRepoPullRequests)); // params: username
app.get("/api/git/repo/members", asyncMiddleware(gitController.triggerStoreRepoMembers)); // params: username
app.get("/api/git/pull_request/commits", asyncMiddleware(gitController.triggerStorePullRequestCommits)); // params: username

// Auth
// app.post("/auth/github", apiController.githubAuth, generateToken, sendToken);

activateCronJobs();

export default app;
