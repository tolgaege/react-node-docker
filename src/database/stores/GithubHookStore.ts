import { GithubHook } from "../entity/GithubHook";
import Database from "../Database";
import { DeleteResult, UpdateResult } from "typeorm";
import logger from "../../util/logger";

export class GithubHookStore {
    static async create(archived: boolean, event: string, sourceMeta: object): Promise<GithubHook> {
        const githubHook = new GithubHook(archived, event, sourceMeta);
        const connection = Database.getConnection();
        return await connection
        .getRepository(GithubHook)
        .save(githubHook);
    }
}
