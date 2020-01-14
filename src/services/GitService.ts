import { Repository } from "../database/entity/Repository";
import { Organization } from "../database/entity/Organization";
import { Member } from "../database/entity/Member";
import { Commit } from "../database/entity/Commit";
import { PullRequest } from "../database/entity/PullRequest";
import { OrganizationStore } from "../database/stores/OrganizationStore";
import { RepositoryStore } from "../database/stores/RepositoryStore";
import logger from "../util/logger";
import { ResponseAsJSON } from "request";
import rp from "request-promise";
import parseLinkHeader from "parse-link-header";
import { App } from "@octokit/app";


export class GitService {
  GITHUB_URL: string = "https://api.github.com"
  accessToken: string
  query: (url: string) => Promise<ResponseAsJSON>

  constructor() {

    // https://developer.github.com/v3/pulls/comments/#reactions-summary
    // Enables Github Comment Reactions
    const commentReactionsHeader = "application/vnd.github.squirrel-girl-preview";

    // https://developer.github.com/v3/pulls/comments/#list-comments-on-a-pull-request
    // Enables Github Multiline comments
    const commentMultiLineHeader = "application/vnd.github.comfort-fade-preview+json";


    // https://developer.github.com/v3/repos/collaborators/#list-collaborators
    // Enables Github Nested Teams
    const nestedTeamsHeader = "application/vnd.github.hellcat-preview+json";


    // https://developer.github.com/v3/apps/#get-the-authenticated-github-app
    // Enables Github App Auth
    const appAuthHeader = "application/vnd.github.machine-man-preview+json";

    const headers = [
      commentReactionsHeader,
      commentMultiLineHeader,
      nestedTeamsHeader,
      appAuthHeader
    ].join(", ");

    this.query = async (url: string) => {
      logger.info(url);
      return await rp(url, {
        headers: {
          "User-Agent": "usehaystack.io",
          "accept": headers
        },
        "auth": {
          "bearer": `${this.accessToken}`
        },
        json: true,
        resolveWithFullResponse: true
      });
    };
  }

  async setup(installationId: number) {
    if (!installationId) {
      throw Error("installationId not provided");

    }

    this.accessToken = await this.getInstallationAccessToken(installationId);
    logger.info(`Access Token: ${this.accessToken}`);
  }

  validate() {
    if (!this.accessToken) {
      throw Error("Validation Fail: accessToken does not exist.\nCall setup()");
    }
  }

  /* ========================= Organization ========================= */

  async *getUserOrganizations() {
    const perPage = 100;
    const url = this.GITHUB_URL + `/user/orgs?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  async *getOrganization(orgKey: string) {
    const url = this.GITHUB_URL + `/orgs/${orgKey}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  async *getOrganizationTeams(orgKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/orgs/${orgKey}/teams?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  async *getOrganizationRepository(orgKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/orgs/${orgKey}/repos?per_page=${perPage}`;
    yield *this.paginate(url);
  }

  async *getOrganizationMembers(orgKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/orgs/${orgKey}/members?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  async *getOrganizationOutsideCollaborators(orgKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/orgs/${orgKey}/outside_collaborators?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  /* ========================= Team ========================= */

  async *getTeamMembers(teamKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/teams/${teamKey}/members?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  async *getTeamRepositories(teamKey: string) {
    const perPage = 100;
    const url = this.GITHUB_URL + `/teams/${teamKey}/repos?per_page=${perPage}`;
    const response = await this.query(url);
    yield *this.paginate(url);
  }

  /* ========================= Repository ========================= */

  async *getRepository(repositoryKey: string) {
    const perPage = 100;
    // `repos/${owner}/${repo}?per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}?per_page=${perPage}`;
    yield *this.paginate(url);
  }

  async *getRepositoryContributors(repositoryKey: string) {
    const perPage = 100;
    // `repos/${owner}/${repo}/contributors?per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}/contributors?per_page=${perPage}`;
    yield *this.paginate(url);
  }

  async *getRepositoryPullRequests(repositoryKey: string) {
    const perPage = 100;
    // `repos/${owner}/${repo}/pulls?state=all&per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}/pulls?state=all&per_page=${perPage}`;
    yield *this.paginate(url);
  }

  /* ========================= Pull Request ========================= */

  async *getPullRequestCommits(repositoryKey: string, pullNumber: number) {
    // TODO: Lists a maximum of 250 commits for a pull request. To receive a
    // complete commit list for pull requests with more than 250 commits, use
    // the Commit List API.
    const perPage = 250;
    // `repos/${owner}/${repo}/pulls/${pullNumber}/commits?per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}/pulls/${pullNumber}/commits?per_page=${perPage}`;
    yield *this.paginate(url);
  }

  async *getRepositoryCommits(repositoryKey: string) {
    const perPage = 250;
    // `repos/${owner}/${repo}/pulls/${pullNumber}/commits?per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}/commits?per_page=${perPage}`;
    yield *this.paginate(url);
  }

  async *getPullRequestComments(repositoryKey: string, pullNumber: number) {
    // TODO: Lists a maximum of 250 commits for a pull request. To receive a
    // complete commit list for pull requests with more than 250 commits, use
    // the Commit List API.
    const perPage = 250;
    // `repos/${owner}/${repo}/pulls/${pullNumber}/comments?per_page=${perPage}`
    const url = this.GITHUB_URL + `/repos/${repositoryKey}/pulls/${pullNumber}/comments?per_page=${perPage}&direction=desc`;
    yield *this.paginate(url);
  }

  /* ========================= Utility ========================= */

  async getInstallationAccessToken(installationId: number): Promise<string> {

    const githubApp = new App({
      id: parseInt(process.env.GITHUB_APP_ID, 10),
      // Node does not handle env variables good
      // https://github.com/octokit/app.js/issues/40
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n")
    });

    const installationAccessToken = await githubApp.getInstallationAccessToken({
      installationId,
    });

    return installationAccessToken;
  }

  async *paginate(url: string) {
    this.validate();
    let rateLimitLimit: number;
    let rateLimitRemaining: number;
    let rateLimitReset: number;
    let eTag: string;
    while (url) {
      const response = await this.query(url);
      const linkHeader = parseLinkHeader(response.headers.link);

      rateLimitLimit = response.headers["x-ratelimit-limit"];
      rateLimitRemaining = response.headers["x-ratelimit-remaining"];
      rateLimitReset = response.headers["x-ratelimit-reset"];
      eTag = response.headers["etag"];

      // if the "link header" is not present or doesn't have the "next" value,
      // "url" will be undefined and the loop will finish
      url = linkHeader && linkHeader.next && linkHeader.next.url;
      yield response.body;
    }

    logger.info("RateLimit:");
    logger.info(`x-ratelimit-limit: ${rateLimitLimit}`);
    logger.info(`x-ratelimit-remaining: ${rateLimitRemaining}`);
    logger.info(`x-ratelimit-reset: ${rateLimitReset}`);
    logger.info(`eTag: ${eTag}`);
  }

}