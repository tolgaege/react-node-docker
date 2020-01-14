import { DeleteResult, UpdateResult } from "typeorm";
import { Commit } from "../entity/Commit";
import { Member, DELETED_MEMBER } from "../entity/Member";
import { Repository } from "../entity/Repository";
import { PullRequestCommit } from "../entity/PullRequestCommit";
import { RepositoryStore } from "./RepositoryStore";
import { PullRequestStore } from "./PullRequestStore";
import { MemberStore } from "./MemberStore";
import Database from "../Database";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";

// export const COMMIT_CACHE_KEY = 'Commit:'
// export const COMMIT_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class CommitStore {

    static async upsert(commit: Commit): Promise<Commit> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Commit)
        .save(commit);
    }

    static async getCommitById(id: number): Promise<Commit | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Commit)
        .createQueryBuilder("commit")
        .where("commit.id= :value", {value: id})
        // .cache(COMMIT_CACHE_KEY + id, COMMIT_CACHE_TTL)
        .getOne();
    }

    static async getCommitBySha(sha: string): Promise<Commit | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Commit)
        .createQueryBuilder("commit")
        .where("commit.sha= :value", {value: sha})
        // .cache(COMMIT_CACHE_KEY + username, COMMIT_CACHE_TTL)
        .getOne();
    }

    static async getCommitsByRepository(repository_id: number): Promise<Commit[] | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Commit)
        .createQueryBuilder("commit")
        .where("commit.repository_id= :value", {value: repository_id})
        // .cache(COMMIT_CACHE_KEY + username, COMMIT_CACHE_TTL)
        .getMany();
    }

    static async parseFromGithub(dataList: any, parseArgs: any): Promise<Commit[]> {
        if (!parseArgs.repositoryKey) {
          throw "Argument does not exist: parseArgs.repositoryKey";
        }

        const repositoryKey = parseArgs.repositoryKey;

        const commits = [];
        for (const data of dataList) {
            const sha = data.sha;
            const date = data.commit.author.date;
            const message = data.commit.message;
            const repository = await RepositoryStore.getRepositoryByKey(repositoryKey);

            let username: string | undefined;
            let avatarUrl: string | undefined;

            // For username
            // First try to get author.login
            // If fails get data.commit.author.name + DELETED_MEMBER (assuming it was  deleted)
            /* ====== AUTHOR ====== */

            // Grab author Member
            if (data.author && data.author.login) {
                username = data.author.login;
                avatarUrl = data.author.avatar_url;
            } else if (!username && data.commit && data.commit.author && data.commit.author.name) {
                username = data.commit.author.name + DELETED_MEMBER;
            }

            let author = await MemberStore.getMemberByUsername(username);
            if (!author) {
                author = new Member(username, avatarUrl, data.commit.author.email, data.commit.author.name);
            } else {
                author.username = username;
                author.avatarUrl = avatarUrl;
                author.email = data.commit.author.email;
                author.name = data.commit.author.name;
            }

            /* ====== COMMITTER ====== */

            if (data.committer && data.committer.login) {
                username = data.committer.login;
                avatarUrl = data.committer.avatar_url;
            } else if (!username && data.commit && data.commit.committer && data.commit.committer.name) {
                username = data.commit.committer.name + DELETED_MEMBER;
            }

            // Grab committer Member
            let committer = await MemberStore.getMemberByUsername(username);
            if (!committer) {
                committer = new Member(username, avatarUrl, data.commit.committer.email, data.commit.committer.name);
            } else {
                committer.username = username;
                committer.avatarUrl = avatarUrl;
                committer.email = data.commit.committer.email;
                committer.name = data.commit.committer.name;
            }

            let commit = await CommitStore.getCommitBySha(sha);
            if (!commit) {
                commit = new Commit(sha, date, message, repository, author, committer);
            } else {
                commit.sha = sha;
                commit.date = date;
                commit.message = message;
                commit.repository = repository;
                commit.author = author;
                commit.committer = committer;
            }

            commits.push(commit);
        }

        return commits;
    }

    static async commitBatchCreator(commits: Commit[], creatorArgs: any): Promise<void> {
      if (!creatorArgs.pullRequest) {
        throw "Argument does not exist: creatorArgs.pullRequest";
      }

      const pullRequest = creatorArgs.pullRequest;
      // Store all commits
      let error = false;
      for await (const commit of commits) {
        let newCommit: Commit;
        try {
            let member = await MemberStore.upsert(commit.author);
            member = await MemberStore.upsert(commit.committer);
            newCommit = await CommitStore.upsert(commit);
            let pullRequestCommit = await PullRequestStore.getPullRequestCommitById(pullRequest.id, newCommit.id);
            if (!pullRequestCommit) {
                pullRequestCommit = new PullRequestCommit(pullRequest, newCommit);
                await PullRequestStore.pullRequestCommitUpsert(pullRequestCommit);
            }
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
