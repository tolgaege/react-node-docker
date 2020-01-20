import { Response, Request, NextFunction } from "express";
import logger from "../util/logger";
import Database from "../database/Database";
import Cache from "../cache/Cache";
import rp from "request-promise";
import { CommitStore } from "../database/stores/CommitStore";
import { PullRequestStore } from "../database/stores/PullRequestStore";
import { MemberStore } from "../database/stores/MemberStore";
import { OrganizationStore } from "../database/stores/OrganizationStore";
import { RepositoryStore } from "../database/stores/RepositoryStore";
import { UserStore } from "../database/stores/UserStore";
import { PullRequest } from "../database/entity/PullRequest";
import { PullRequestCommit } from "../database/entity/PullRequestCommit";
import { Commit } from "../database/entity/Commit";
import { analyzeCycleTime, analyzeThroughput, analyzeActivityHeatmap, analyzeSprintReport } from "./dataAnalyze";

/******************************* Helpers *******************************/
const getPullRequestList = async (req: Request, res: Response): Promise<PullRequest[]> => {
  const username = req.query.username;
  const user = await UserStore.getUserByUsername(username);
  const organization = await OrganizationStore.getOrganizationByUser(user);
  const organizationKey = organization.key;
  

  const repositories = await RepositoryStore.getRepositoriesInOrgByKey(organizationKey);
  const pullRequestList: PullRequest[] = [];
  for await (const repository of repositories) {
    const repositoryKey = repository.key;
    const pullRequests = await PullRequestStore.getPullRequestsInRepoById(repository.id);

    pullRequestList.push(...pullRequests);
  }

  return pullRequestList;
};

/******************************* Endpoints *******************************/

// Filters
// =======
// Date
// Repository
// Team
// Member
export const cycleTime = async (req: Request, res: Response) => {
  logger.info("Started cycleTime");
  if (!req.query.username) {
    res.send(500);
    return;
  }

  const pullRequestList = await getPullRequestList(req, res);

  const result = analyzeCycleTime(pullRequestList);

  logger.info("Finished cycleTime");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
};

// Filters
// =======
// Date
// Repository
// Team
// Member
export const throughput = async (req: Request, res: Response) => {
  logger.info("Started throughput");
  if (!req.query.username) {
    res.send(500);
    return;
  }

  const pullRequestList = await getPullRequestList(req, res);

  const result = analyzeThroughput(pullRequestList);

  logger.info("Finished throughput");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
};

// Filters
// =======
// Date
// Repository
// Team
// Member
export const activityHeatmap = async (req: Request, res: Response) => {
  logger.info("Started activityHeatmap");
  if (!req.query.username) {
    res.send(500);
    return;
  }

  const pullRequestList = await getPullRequestList(req, res);

  const result = analyzeActivityHeatmap(pullRequestList);

  logger.info("Finished activityHeatmap");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
};

// Filters
// =======
// Date
// Repository
// Team
// Member
export const sprintReport = async (req: Request, res: Response) => {
  if (!req.query.username) {
    res.send(500);
    return;
  }

  const pullRequestList = await getPullRequestList(req, res);

  const result = analyzeSprintReport(pullRequestList);

  logger.info("Finished sprintReport");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
};


/******************************* Caching *******************************/

export const refreshMetric = async (metric: string, username: string) => {  
  const BASE_URL = process.env.SITE_URL || "http://haystack:5000";
  logger.info(`---refresh ${metric}--------------------------`); 
  const path = `/api/analytic/${metric}?username=${username}`;

  // Delete cache
  Cache.del(`expressRoute:${path}`);

  // Hit the analytics route, refresh cache
  try { 
    await rp(
      {
        uri: `${BASE_URL}${path}`,
        headers: {
            "User-Agent": "Request-Promise"
        },
        resolveWithFullResponse: true       
      }
    ).then(function(response){
      logger.info(`Refresh ${username} ${metric} Status: ${response.statusCode}`);
    }); 
  } catch (e) { 
    logger.error(`Refresh ${username} ${metric} Error: ${e}`); 
  }
  logger.info("------------------------------------");   
  return true;
};

export const refreshCache = async (username: string) => {
  logger.info("------------------------------------------");
  logger.info("----------- REFRESHING CACHE -------------");
  await refreshMetric("activity_heatmap",username);
  await refreshMetric("cycle_time",username);
  await refreshMetric("sprint_report",username);
  await refreshMetric("throughput",username);
};

export const triggerRefreshCache = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  await refreshCache(req.query.username);

  res.send("true");  
};
