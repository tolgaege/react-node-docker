import { DeleteResult, UpdateResult } from "typeorm";
import Database from "../Database";
import { Repository } from "../entity/Repository";
import { Organization } from "../entity/Organization";
import { TeamRepository } from "../entity/TeamRepository";
import { OrganizationStore } from "./OrganizationStore";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";

// export const REPOSITORY_CACHE_KEY = 'Repository:'
// export const REPOSITORY_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class RepositoryStore {

  static async create(name: string, key: string, htmlUrl: string, sshUrl: string, cloneUrl: string, organization: Organization, sourceMeta: object, description?: string): Promise<Repository> {
    const repository = new Repository(name, key, htmlUrl, sshUrl, cloneUrl, organization, sourceMeta, description);
    const connection = Database.getConnection();
    return await connection
                 .getRepository(Repository)
                 .save(repository);
  }

  static async getRepositoryById(id: number): Promise<Repository | undefined> {
    const connection = Database.getConnection();
    return await connection
    .getRepository(Repository)
    .createQueryBuilder("repository")
    .where("repository.id= :value", {value: id})
    // .cache(REPOSITORY_CACHE_KEY + id, REPOSITORY_CACHE_TTL)
    .getOne();
  }

  static async getRepositoryByKey(key: string): Promise<Repository | undefined> {
    const connection = Database.getConnection();
    return await connection
    .getRepository(Repository)
    .createQueryBuilder("repository")
    .where("repository.key= :value", {value: key})
    // .cache(REPOSITORY_CACHE_KEY + id, REPOSITORY_CACHE_TTL)
    .getOne();
  }

  static async getRepositoriesInOrgById(orgId: number): Promise<Repository[] | undefined> {
    const connection = Database.getConnection();
    return await connection
    .getRepository(Repository)
    .createQueryBuilder("repository")
    .where("repository.organization_id= :value", {value: orgId})
    // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
    .getMany();
  }

  static async getRepositoriesInOrgByKey(orgKey: string): Promise<Repository[] | undefined> {
    const connection = Database.getConnection();
    return await connection
    .getRepository(Repository)
    .createQueryBuilder("repository")
    .leftJoinAndSelect("organization", "organization", "repository.organization_id=organization.id")
    .where("organization.key= :value", {value: orgKey})
    // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
    .getMany();
  }

  static async parseFromGithub(dataList: any): Promise<Repository[]> {
    const repositories = [];
    for (const data of dataList) {
      const key = data.full_name;
      const name = data.name;
      const htmlUrl = data.html_url;
      const sshUrl = data.ssh_url;
      const cloneUrl = data.clone_url;
      const sourceMeta = data;
      const description = data.description;

      // Get organization
      const organizationKey = key.split("/")[0]; // 'jbtv/jukeboxu' ==> 'jbtv'
      const organization = await OrganizationStore.getOrganizationByKey(organizationKey);

      const repository = new Repository(name, key, htmlUrl, sshUrl, cloneUrl, organization, sourceMeta, description);
      repositories.push(repository);
    }

    return repositories;
  }

  static async repositoryBatchCreator(repositories: Repository[]): Promise<void> {
    // Store all repositories
    let error = false;
    for await (const repository of repositories) {
      try {
          await RepositoryStore.create(
            repository.name,
            repository.key,
            repository.htmlUrl,
            repository.sshUrl,
            repository.cloneUrl,
            repository.organization,
            repository.sourceMeta,
            repository.description
          );
      } catch (e) {
        // If any fails, set an indicator. Try to still add all the batch
        // but make sure to throw error in the end
        error = e;
      }
    }

    if (error) {
      throw error;
    }
  }

  static async teamRepositoryBatchCreator(repositories: Repository[], creatorArgs: any): Promise<void> {
    if (!creatorArgs.team) {
      throw "Argument does not exist: creatorArgs.team";
    }

    const team = creatorArgs.team;

    // Store all repositories
    let error = false;
    for await (const repository of repositories) {
      try {
        // let teamRepository = await PullRequestStore.getTeamRepositoryById(pullRequest.id, newCommit.id);
        // if (!teamRepository) {

        const repositoryWithId = await RepositoryStore.getRepositoryByKey(repository.key);

        const teamRepository = new TeamRepository(team, repositoryWithId);
        const connection = Database.getConnection();
        await connection
            .getRepository(TeamRepository)
            .save(teamRepository);
        // }
      } catch (e) {
        // If any fails, set an indicator. Try to still add all the batch
        // but make sure to throw error in the end
        error = e;
      }
    }

    if (error) {
      throw error;
    }
  }


  // Get repository key from url
  // 'https://api.github.com/repos/jbtv/iris_api/pulls/608' ==> 'jbtv/iris_api'
  static createKeyFromUrl(url: string): string {
    const splitUrl = url.split("/");
    const org = splitUrl[4];
    const repo = splitUrl[5];
    return `${org}/${repo}`;
  }
}
