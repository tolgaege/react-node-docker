import {DeleteResult, UpdateResult} from "typeorm";
import Database from "../Database";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";
import { Team } from "../entity/Team";
import { Organization } from "../entity/Organization";
import { OrganizationStore } from "./OrganizationStore";

// export const TEAM_CACHE_KEY = 'Team:'
// export const TEAM_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class TeamStore {

  static async create(name: string, key: string, slug: string, organization: Organization, sourceMeta: object, description?: string): Promise<Team> {
      const team = new Team(name, key, slug, organization, sourceMeta, description);
      const connection = Database.getConnection();
      return await connection
      .getRepository(Team)
      .save(team);
  }

  static async getTeamById(id: number): Promise<Team | undefined> {
      const connection = Database.getConnection();
      return await connection
      .getRepository(Team)
      .createQueryBuilder("team")
      .where("team.id= :value", {value: id})
      // .cache(TEAM_CACHE_KEY + id, TEAM_CACHE_TTL)
      .getOne();
  }

  static async getTeamByKey(key: string): Promise<Team | undefined> {
      const connection = Database.getConnection();
      return await connection
      .getRepository(Team)
      .createQueryBuilder("team")
      .where("team.key= :value", {value: key})
      // .cache(TEAM_CACHE_KEY + key, TEAM_CACHE_TTL)
      .getOne();
  }

  static async getTeamsInOrganizationByKey(orgKey: string): Promise<Team[] | undefined> {
      const connection = Database.getConnection();
      return await connection
      .getRepository(Team)
      .createQueryBuilder("team")
      .leftJoinAndSelect("organization", "organization", "team.organization_id=organization.id")
      .where("organization.key= :value", {value: orgKey})
      // .cache(TEAM_CACHE_KEY + id, TEAM_CACHE_TTL)
      .getMany();
  }

  static async parseFromGithub(dataList: any, parseArgs: any): Promise<Team[]> {
      if (!parseArgs.organizationKey) {
        throw "Argument does not exist: parseArgs.organizationKey";
      }

      const organizationKey = parseArgs.organizationKey;

      const teams = [];
      for (const data of dataList) {
          const name = data.name;
          const key = data.id;
          const slug = data.slug;
          const sourceMeta = data;
          const description = data.description;

          // Get organization
          const organization = await OrganizationStore.getOrganizationByKey(organizationKey);

          const team = new Team(name, key, slug, organization, sourceMeta, description);
          teams.push(team);
      }

      return teams;
  }

  static async teamBatchCreator(teams: Team[]): Promise<void> {
    // Store all teams
    let error = false;
    for await (const team of teams) {
      try {
          await TeamStore.create(
            team.name,
            team.key,
            team.slug,
            team.organization,
            team.sourceMeta,
            team.description
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
}
