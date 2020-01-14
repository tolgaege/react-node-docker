import { DeleteResult, UpdateResult } from "typeorm";
import Database from "../Database";
import { PullRequest } from "../entity/PullRequest";
import { PullRequestCommit } from "../entity/PullRequestCommit";
import { Repository } from "../entity/Repository";
import { Commit } from "../entity/Commit";
import { Member } from "../entity/Member";
import { Team } from "../entity/Team";
import { TeamMember } from "../entity/TeamMember";
import { RepositoryStore } from "./RepositoryStore";
import { CommitStore } from "./CommitStore";
import { MemberStore } from "./MemberStore";

import Cache from "../../cache/Cache";
import logger from "../../util/logger";

export const PULL_REQUEST_CACHE_KEY = "PullRequest:";
export const PULL_REQUEST_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class PullRequestStore {

    static async create(pullRequest: PullRequest): Promise<PullRequest> {
        const connection = Database.getConnection();
        return await connection
            .getRepository(PullRequest)
            .save(pullRequest);
    }

    static async getPullRequestById(id: number): Promise<PullRequest | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .where("pull_request.id= :value", {value: id})
        // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
        .getOne();
    }

    static async getPullRequestByKey(key: string): Promise<PullRequest | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .where("pull_request.key= :value", {value: key})
        // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
        .getOne();
    }

    static async getPullRequestsInRepoById(repoId: number): Promise<PullRequest[] | undefined> {
        const connection = Database.getConnection();
        const pullRequests = await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .leftJoinAndSelect("pull_request.pullRequestCommits", "pull_request__commit")
        .leftJoinAndSelect("pull_request__commit.commit", "commit")
        // .leftJoinAndSelect("pull_request.repository", "repository")
        // .leftJoinAndSelect("pull_request.creator", "creator")
        // .leftJoinAndSelect("creator.teamMembers", "teamMembers")
        // .leftJoinAndSelect("teamMembers.team", "team")
        .where("pull_request.repository_id= :value", {value: repoId})
        // .limit(5)
        // .cache(PULL_REQUEST_CACHE_KEY + "repo:" + repoId, PULL_REQUEST_CACHE_TTL)
        .getMany();

        const pullRequestsWithRepo = await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .leftJoinAndSelect("pull_request.repository", "repository")
        .where("pull_request.repository_id= :value", {value: repoId})
        .getMany();

        const pullRequestsWithTeam = await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .leftJoinAndSelect("pull_request.creator", "creator")
        .leftJoinAndSelect("creator.teamMembers", "teamMembers")
        .leftJoinAndSelect("teamMembers.team", "team")
        .where("pull_request.repository_id= :value", {value: repoId})
        // .limit(5)
        // .cache(PULL_REQUEST_CACHE_KEY + "repo:" + repoId, PULL_REQUEST_CACHE_TTL)
        .getMany();

        for (let i = 0; i < pullRequests.length; ++i) {
            pullRequests[i].repository = pullRequestsWithRepo[i].repository;
            pullRequests[i].creator = pullRequestsWithTeam[i].creator;
        }

        return pullRequests;
    }

    static async getPullRequestsInRepoByKey(repoKey: string): Promise<PullRequest[] | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(PullRequest)
        .createQueryBuilder("pull_request")
        .leftJoinAndSelect("repository", "repository", "pull_request.repository_id=repository.id")
        .where("repository.key= :value", {value: repoKey})
        .orderBy("pull_request.number", "DESC")
        // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
        .getMany();
    }

    static async update(modifiedPullRequest: PullRequest): Promise<PullRequest> {
        const pr = await this.getPullRequestById(modifiedPullRequest.id);
        if(!pr) {
            // Throw error here
            return Promise.reject();
        }

        const connection = Database.getConnection();
        const res = await connection
        .getRepository(PullRequest)
        .save(modifiedPullRequest);
        // Cache.del(PULL_REQUEST_CACHE_KEY + pr.id)
        return res;
    }

    static async pullRequestCommitUpsert(pullRequestCommit: PullRequestCommit): Promise<PullRequestCommit> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(PullRequestCommit)
        .save(pullRequestCommit);
    }

    static async getPullRequestCommitById(pullRequestId: number, commitId: number): Promise<PullRequestCommit | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(PullRequestCommit)
        .createQueryBuilder("pull_request__commit")
        .where("pull_request_id= :prValue AND commit_id= :commitValue", {prValue: pullRequestId, commitValue: commitId})
        // .cache(PULL_REQUEST_CACHE_KEY + id, PULL_REQUEST_CACHE_TTL)
        .getOne();
    }

    static async parseFromGithub(dataList: any): Promise<PullRequest[]> {
        const pullRequests = [];
        for (const data of dataList) {
            const url = data.url;
            const state = data.state;
            const number = data.number;
            const prCreatedAt = new Date(data.created_at);
            const prUpdatedAt = new Date(data.updated_at);
            const labels = data.labels;
            const sourceMeta = data;
            const title = data.title;
            const body = data.body;
            const prClosedAt = new Date(data.closed_at) || undefined;
            const prMergedAt = new Date(data.merged_at) || undefined;

            // Grab creator Member
            let creator = await MemberStore.getMemberByUsername(data.user.login);
            if (!creator) {
                creator = new Member(data.user.login, data.user.avatar_url, null, null);
            }

            // Grab repository
            const repositoryKey = RepositoryStore.createKeyFromUrl(url);
            const repository = await RepositoryStore.getRepositoryByKey(repositoryKey);

            // Create key
            const key = PullRequestStore.createKeyFromUrl(url);

            let pullRequest = await PullRequestStore.getPullRequestByKey(key);
            if (!pullRequest) {
                pullRequest = new PullRequest(key, url, state, number, prCreatedAt, prUpdatedAt, repository, labels, creator, sourceMeta, title, body, prClosedAt, prMergedAt);
            } else {
                pullRequest.key = key;
                pullRequest.url = url;
                pullRequest.state = state;
                pullRequest.number = number;
                pullRequest.prCreatedAt = prCreatedAt;
                pullRequest.prUpdatedAt = prUpdatedAt;
                pullRequest.repository = repository;
                pullRequest.labels = labels;
                pullRequest.creator = creator;
                pullRequest.title = title;
                pullRequest.body = body;
                pullRequest.prClosedAt = prClosedAt;
                pullRequest.prMergedAt = prMergedAt;

                // Do not update sourceMeta since he changes all the time
                // pullRequest.sourceMeta = sourceMeta
            }

            pullRequests.push(pullRequest);
        }

        return pullRequests;
    }

    static async pullRequestBatchCreator(pullRequests: PullRequest[]): Promise<void> {
      // Store all pull requests
      let error = false;
      for await (const pullRequest of pullRequests) {
        try {
          await PullRequestStore.create(pullRequest);
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

    // Get pull request key from url
    // 'https://api.github.com/repos/jbtv/iris_api/pulls/608' ==> 'jbtv/iris_api/608'
    static createKeyFromUrl(url: string): string {
        const splitUrl = url.split("/");
        const org = splitUrl[4];
        const repo = splitUrl[5];
        const pullNumber = splitUrl[7];
        return `${org}/${repo}/${pullNumber}`;
    }
}
