import Database from "../Database";
import { Organization } from "../entity/Organization";
import { User } from "../entity/User";
import { UserStore } from "./UserStore";
import {DeleteResult, UpdateResult} from "typeorm";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";

// export const ORGANIZATION_CACHE_KEY = 'Organization:'
// export const ORGANIZATION_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class OrganizationStore {

    static async create(key: string, url: string, avatarUrl: string, sourceMeta: object, user: User, email?: string, description?: string, company?: string, blog?: string, location?: string, type?: string, name?: string): Promise<Organization> {
        const organization = new Organization(key, url, avatarUrl, sourceMeta, user, email, description, company, blog, location, type, name);
        const connection = Database.getConnection();
        return await connection
                     .getRepository(Organization)
                     .save(organization);
    }

    static async getOrganizationById(id: number): Promise<Organization | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Organization)
        .createQueryBuilder("organization")
        .where("organization.id= :value", {value: id})
        // .cache(ORGANIZATION_CACHE_KEY + id, ORGANIZATION_CACHE_TTL)
        .getOne();
    }

    static async getOrganizationByKey(key: string): Promise<Organization | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Organization)
        .createQueryBuilder("organization")
        .where("organization.key= :value", {value: key})
        // .cache(ORGANIZATION_CACHE_KEY + id, ORGANIZATION_CACHE_TTL)
        .getOne();
    }

    static async getOrganizationByUser(user: User): Promise<Organization | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Organization)
        .createQueryBuilder("organization")
        .where("organization.user_id= :value", {value: user.id})
        // .cache(ORGANIZATION_CACHE_KEY + id, ORGANIZATION_CACHE_TTL)
        .getOne();
    }

    static async parseFromGithub(dataList: any, parseArgs: any): Promise<Organization[]> {
        if (!parseArgs.userId) {
          throw "Argument does not exist: parseArgs.userId";
        }

        const userId = parseArgs.userId;


        // Since org endpoint returns singular response, this is a small hack to
        // represent it
        const data = dataList;

        const key = data.login;
        const url = data.url;
        const email = data.email;
        const avatarUrl = data.avatar_url;
        const description = data.description;
        const company = data.company;
        const blog = data.blog;
        const location = data.location;
        const type = data.type;
        const name = data.name;
        const sourceMeta = data;

        // Grab user
        const user = await UserStore.getUserById(userId);

        const organization = new Organization(key, url, avatarUrl, sourceMeta, user, email, description, company, blog, location, type, name);

        return [organization];
    }

    static async organizationBatchCreator(organizations: Organization[], creatorArgs: any): Promise<void> {
      // Store all organizations
      let error = false;
      for await (const organization of organizations) {
        try {
            await OrganizationStore.create(
              organization.key,
              organization.url,
              organization.avatarUrl,
              organization.sourceMeta,
              organization.user,
              organization.email,
              organization.description,
              organization.company,
              organization.blog,
              organization.location,
              organization.type,
              organization.name
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
