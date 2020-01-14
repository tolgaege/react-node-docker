import _ from "lodash";
import github from "octonode";
import { Response, Request, NextFunction } from "express";
import { OrganizationStore } from "../database/stores/OrganizationStore";
import { RepositoryStore } from "../database/stores/RepositoryStore";
import { PullRequestStore } from "../database/stores/PullRequestStore";
import { UserStore } from "../database/stores/UserStore";
import { MemberStore } from "../database/stores/MemberStore";
import { CommitStore } from "../database/stores/CommitStore";
import { TeamStore } from "../database/stores/TeamStore";
import { GitService } from "../services/GitService";
import { Repository } from "../database/entity/Repository";
import { Commit } from "../database/entity/Commit";
import { PullRequest } from "../database/entity/PullRequest";
import { Member } from "../database/entity/Member";
import { Team, DEFAULT_TEAM } from "../database/entity/Team";
import logger from "../util/logger";
import * as healthcheck from "../util/healthcheck";
import * as analyticController from "../controllers/analytic";



// TODO: create interface for adder func
const databaseInserter = async (
      iterator: any,
      parser: (dataList: any, args?: any) => Promise<any>,
      creator: (entities: any, args?: any) => Promise<void>,
      parseArgs?: any,
      creatorArgs?: any
    ) => {
  const entityList: any[] = [];
  for await (const response of iterator) {
    const entities = await parser(response, parseArgs);
    entityList.push(...entities);

    try {
      await creator(entities, creatorArgs);
    } catch (e) {
      // If we get duplicate in any batch, stop executing
      logger.info("Error" + e);
      break;
    }
  }
  return entityList;
};

/**
 * GET /api/git/org
 * GET Git org info.
 */
export const storeOrgInfo = async (username: string, organizationKey: string) => {
  logger.info("---Start storeOrgInfo--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const userId = user.id;

  const gitService = new GitService();
  await gitService.setup(installationId);

  const iterator = gitService.getOrganization(organizationKey);
  const org = await databaseInserter(iterator, OrganizationStore.parseFromGithub, OrganizationStore.organizationBatchCreator, {userId: userId});

  logger.info("---storeOrgInfo Complete--------------------------");
  return org;
};


/**
 * GET /api/git/org/repos
 * GET (and store) Git org repos.
 */
export const storeOrgRepos = async (username: string) => {
  logger.info("---Start storeOrgRepos--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const iterator = gitService.getOrganizationRepository(organization.key);
  const repoList = await databaseInserter(iterator, RepositoryStore.parseFromGithub, RepositoryStore.repositoryBatchCreator);

  logger.info("---Complete storeOrgRepos--------------------------");
  return repoList;  
};

/**
 * GET /api/git/org/teams
 * GET (and store) Git org teams.
 */
export const storeOrgTeams = async (username: string) => {
  logger.info("---Start storeOrgTeams--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const iterator = gitService.getOrganizationTeams(organization.key);
  const repoList = await databaseInserter(iterator, TeamStore.parseFromGithub, TeamStore.teamBatchCreator, { organizationKey: organization.key });

  logger.info("---Complete storeOrgTeams--------------------------");
  return repoList;  
};

/**
 * GET /api/git/org/members
 * GET (and store) Git org members.
 * - Creates a psedo team
 *   - Assigns Org Members
 *   - Assigns Org Outside Collaborators
 *   - Assigns Org Repos (NOTE: DOES ONLY SQL QUERY, NOT API CALL)
 */
export const storeOrgMembers = async (username: string) => {
  logger.info("---Start storeOrgMembers--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);

  // Get all Members of the Organization
  let iterator = gitService.getOrganizationMembers(organization.key);
  const memberList: Member[] = [];
  for await (const response of iterator) {
    const entities = await MemberStore.parseFromGithub(response);
    memberList.push(...entities);
  }

  // Get all outside Collaborators of the Organization
  iterator = gitService.getOrganizationOutsideCollaborators(organization.key);
  for await (const response of iterator) {
    const entities = await MemberStore.parseFromGithub(response);
    memberList.push(...entities);
  }

  // Get all repos beloning to Organization
  const repositoryList = await RepositoryStore.getRepositoriesInOrgById(organization.id);

  // Create a Pseddo Team
  const defaultTeamName = organization.key + DEFAULT_TEAM;
  const name = defaultTeamName;
  const key = defaultTeamName;
  const slug = defaultTeamName;
  const description = `All members of ${organization.key}`;
  const sourceMeta = {};

  let team = await TeamStore.getTeamByKey(key);
  if (!team) {
    team = await TeamStore.create(name, key, slug, organization, sourceMeta, description);
  }

  // Create and Assign members to the team
  await MemberStore.teamMemberBatchCreator(memberList, { team: team });

  // Assign repositories to the team
  await RepositoryStore.teamRepositoryBatchCreator(repositoryList, { team: team });

  logger.info("---Complete storeOrgMembers--------------------------");
  return memberList;  
};

/**
 * GET /api/git/org/team/members
 * GET (and store) Git team members.
 */
export const storeOrgTeamMembers = async (username: string) => {
  logger.info("---Start storeOrgTeamMembers--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);
  const teams = await TeamStore.getTeamsInOrganizationByKey(organization.key);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const memberList: any = [];
  for await (const team of teams) {
    logger.info(`Team Name: ${team.name}`);
    if (team.name.includes(DEFAULT_TEAM)) {
      continue;
    }
    const iterator = gitService.getTeamMembers(team.key);
    const members = await databaseInserter(iterator, MemberStore.parseFromGithub, MemberStore.teamMemberBatchCreator, undefined, { team: team });
    memberList.push({ teamName: team.name, members: members });
  }

  logger.info("---Complete storeOrgTeamMembers--------------------------");
  return memberList;  
};

/**
 * GET /api/git/org/team/repos
 * GET (and store) Git team repos.
 *
 * Should be called after getting all repos in the org
 */
export const storeTeamRepositories = async (username: string) => {
  logger.info("---Start storeTeamRepositories--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);
  const teams = await TeamStore.getTeamsInOrganizationByKey(organization.key);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const repositoryList: any = [];
  for await (const team of teams) {
    logger.info(`Team Name: ${team.name}`);
    if (team.name.includes(DEFAULT_TEAM)) {
      continue;
    }
    const iterator = gitService.getTeamRepositories(team.key);
    const repositories = await databaseInserter(iterator, RepositoryStore.parseFromGithub, RepositoryStore.teamRepositoryBatchCreator, undefined , { team: team });
    repositoryList.push({ teamName: team.name, repositories: repositories });
  }

  logger.info("---Complete storeTeamRepositories--------------------------");
  return repositoryList;  
};

/**
 * GET /api/git/repo/members
 * GET (and store) Git repo members/contributors.
 */
export const storeRepoMembers = async (username: string) => {
  logger.info("---Start storeRepoMembers--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const repositories = await RepositoryStore.getRepositoriesInOrgByKey(organization.key);

  const memberList: any = [];
  for await (const repository of repositories) {
    logger.info(`Repository Key: ${repository.key}`);
    const iterator = gitService.getRepositoryContributors(repository.key);
    const members = await databaseInserter(iterator, MemberStore.parseFromGithub, MemberStore.repositoryMemberBatchCreator, undefined , { repository: repository });
    memberList.push({ repoName: repository.name, members: members });
  }

  logger.info("---Complete storeRepoMembers--------------------------");
  return memberList;  
};

/**
 * GET /api/git/repo/pull_requests
 * GET (and store) Git repo pull_requests.
 */
export const storeRepoPullRequests = async (username: string) => {
  logger.info("---Start storeRepoPullRequests--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);

  const repositories = await RepositoryStore.getRepositoriesInOrgByKey(organization.key);

  const pullRequestList: any = [];
  for await (const repository of repositories) {
    logger.info(`Repository Key: ${repository.key}`);
    const iterator = gitService.getRepositoryPullRequests(repository.key);
    const pullRequests = await databaseInserter(iterator, PullRequestStore.parseFromGithub, PullRequestStore.pullRequestBatchCreator);
    pullRequestList.push({ repositoryName: repository.name, pullRequests: pullRequests });
  }

  logger.info("---Complete storeRepoPullRequests--------------------------");
  return pullRequestList;  
};

/**
 * GET /api/git/pull_request/commits
 * GET Store pull_request commits.
 */
export const storePullRequestCommits = async (username: string) => {
  logger.info("---Start storePullRequestCommits--------------------------");
  const user = await UserStore.getUserByUsername(username);
  const installationId = user.installationId;
  const organization = await OrganizationStore.getOrganizationByUser(user);

  const gitService = new GitService();
  await gitService.setup(installationId);
  const repositories = await RepositoryStore.getRepositoriesInOrgByKey(organization.key);

  const commitList: any = [];
  for await (const repository of repositories) {
    const repositoryKey = repository.key;
    const pullRequests = await PullRequestStore.getPullRequestsInRepoByKey(repositoryKey);

    for await (const pullRequest of pullRequests) {
      await gitService.setup(installationId);
      const iterator = gitService.getPullRequestCommits(repositoryKey, pullRequest.number);
      const commits = await databaseInserter(iterator, CommitStore.parseFromGithub, CommitStore.commitBatchCreator, {repositoryKey: repositoryKey} ,{pullRequest: pullRequest});
      commitList.push({ pullRequestNmae: pullRequest.number, commits: commits });
    }
  }

  logger.info("---Complete storePullRequestCommits--------------------------");
  return commitList;  
};


/**
 * Refresh all data for all clients
 */
export const refreshAll = async () => {

  healthcheck.notifyStart(process.env.HEALTHCHECK_REFRESH_DATA_PING_URL);

  // Get all users
  const users = await UserStore.getAllUsers(); 
  for await (const user of users) {   
    try {
      logger.info("------------------------------------------");
      logger.info("----------- REFRESHING DATA --------------");
      logger.info(`--------user: ${user.username}-----------`);

      // Get user org
      const organization = await OrganizationStore.getOrganizationByUser(user);
      logger.info(`--------org: ${organization.key}-----------`);

      // Refresh all data
      try { await storeOrgInfo(user.username,organization.key); } catch (e) { logger.error(`storeOrgInfo Error: ${e}`); }
      try { await storeOrgRepos(user.username); } catch (e) { logger.error(`storeOrgRepos Error: ${e}`); }
      try { await storeOrgTeams(user.username); } catch (e) { logger.error(`storeOrgTeams Error: ${e}`); }
      try { await storeOrgTeamMembers(user.username); } catch (e) { logger.error(`storeOrgTeamMembers Error: ${e}`); }
      try { await storeTeamRepositories(user.username); } catch (e) { logger.error(`storeTeamRepositories Error: ${e}`); }
      try { await storeOrgMembers(user.username); } catch (e) { logger.error(`storeOrgMembers Error: ${e}`); }
      try { await storeRepoPullRequests(user.username); } catch (e) { logger.error(`storeRepoPullRequests Error: ${e}`); }
      try { await storeRepoMembers(user.username); } catch (e) { logger.error(`storeRepoMembers Error: ${e}`); }
      try { await storePullRequestCommits(user.username); } catch (e) { logger.error(`storePullRequestCommits Error: ${e}`); }

      // Refresh the cache
      await analyticController.refreshCache(user.username);

    } catch (e) {
      logger.error(`ERROR!!!!!!!!!!: ${e}`);

      healthcheck.notifyFail(process.env.HEALTHCHECK_REFRESH_DATA_PING_URL);
    }

    logger.info("end");
  }

  healthcheck.notifySuccess(process.env.HEALTHCHECK_REFRESH_DATA_PING_URL);

  return true;
};

/**
 * Preps db with some init data (for local development)
 */
export const prepdb = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Prepping DB...");
  if (process.env.NODE_ENV === "development") {
    const user = await UserStore.create("julianmcolina", 5837271, "Julian", "julian@usehaystack.io"); // Haystack Local App ID
    const org = await OrganizationStore.create("usehaystack", "https://api.github.com/orgs/usehaystack", "https://avatars2.githubusercontent.com/u/949007?v=4", {"id": 949007, "url": "https://api.github.com/orgs/jbtv", "blog": "iris.tv", "name": null, "plan": {"name": "platinum", "seats": 0, "space": 976562499, "filled_seats": 59, "private_repos": 125}, "type": "Organization", "email": null, "login": "jbtv", "company": null, "node_id": "MDEyOk9yZ2FuaXphdGlvbjk0OTAwNw==", "html_url": "https://github.com/jbtv", "location": "Los Angeles", "followers": 0, "following": 0, "hooks_url": "https://api.github.com/orgs/jbtv/hooks", "repos_url": "https://api.github.com/orgs/jbtv/repos", "avatar_url": "https://avatars2.githubusercontent.com/u/949007?v=4", "created_at": "2011-07-30T19:46:40Z", "disk_usage": 3202022, "events_url": "https://api.github.com/orgs/jbtv/events", "issues_url": "https://api.github.com/orgs/jbtv/issues", "updated_at": "2019-09-28T21:13:23Z", "description": null, "is_verified": false, "members_url": "https://api.github.com/orgs/jbtv/members{/member}", "public_gists": 0, "public_repos": 17, "billing_email": "hello@jukeboxtelevision.com", "collaborators": 16, "private_gists": 0, "public_members_url": "https://api.github.com/orgs/jbtv/public_members{/member}", "owned_private_repos": 111, "total_private_repos": 111, "has_repository_projects": true, "has_organization_projects": true, "default_repository_permission": "none", "two_factor_requirement_enabled": false, "members_can_create_repositories": false}, user);
    logger.info("DB prepped");
    res.send("DB prepped");
  } else {
    logger.info("Error prepping DB");
    res.send("Error prepping DB");
  }
};


// A bunch of dumb wrapper functions so we can trigger data pulls from a curl request
// These are just for internal use. Not really necessary
export const triggerStoreOrgInfo = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }
  if (!req.query.organizationKey){
    res.sendStatus(500);
    return; 
  }

  res.send(storeOrgInfo(req.query.username, req.query.organizationKey));  
};

export const triggerStoreOrgRepos = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeOrgRepos(req.query.username));  
};

export const triggerStoreOrgTeams = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeOrgTeams(req.query.username));  
};

export const triggerStoreOrgTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeOrgTeamMembers(req.query.username));  
};

export const triggerStoreTeamRepositories = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeTeamRepositories(req.query.username));  
};

export const triggerStoreOrgMembers = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeOrgMembers(req.query.username));  
};

export const triggerStoreRepoPullRequests = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeRepoPullRequests(req.query.username));  
};

export const triggerStoreRepoMembers = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storeRepoMembers(req.query.username));  
};

export const triggerStorePullRequestCommits = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username){
    res.sendStatus(500);
    return; 
  }

  res.send(storePullRequestCommits(req.query.username));  
};

