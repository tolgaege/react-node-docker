import { Member, DELETED_MEMBER } from "../entity/Member";
import { TeamMember } from "../entity/TeamMember";
import { RepositoryMember } from "../entity/RepositoryMember";
import { Team } from "../entity/Team";
import { Repository } from "../entity/Repository";
import Database from "../Database";
import {DeleteResult, UpdateResult} from "typeorm";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";

// export const MEMBER_CACHE_KEY = 'Member:'
// export const MEMBER_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class MemberStore {

    static async create(username: string, avatarUrl: string, email?: string, name?: string): Promise<Member> {
        const member = new Member(username, avatarUrl, email, name);
        const connection = Database.getConnection();
        return await connection
        .getRepository(Member)
        .save(member);
    }

    static async upsert(member: Member): Promise<Member> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Member)
        .save(member);
    }

    static async getMemberById(id: number): Promise<Member | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(Member)
        .createQueryBuilder("member")
        .where("member.id= :value", {value: id})
        // .cache(MEMBER_CACHE_KEY + id, MEMBER_CACHE_TTL)
        .getOne();
    }

    static async getMemberByUsername(username: string): Promise<Member | undefined> {
        const connection = Database.getConnection();
        let member = await connection
        .getRepository(Member)
        .createQueryBuilder("member")
        .where("member.username= :value", {value: username})
        // .cache(MEMBER_CACHE_KEY + username, MEMBER_CACHE_TTL)
        .getOne();

        if (!member) {
          member = await connection
          .getRepository(Member)
          .createQueryBuilder("member")
          .where("member.username= :value", {value: username + DELETED_MEMBER})
          // .cache(MEMBER_CACHE_KEY + username, MEMBER_CACHE_TTL)
          .getOne();
        }

        return member;
    }

    static async getTeamMember(team_id: number, member_id: number): Promise<TeamMember | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(TeamMember)
        .createQueryBuilder("team__member")
        .where("team__member.member_id= :member_id AND team__member.team_id= :team_id", {team_id: team_id, member_id: member_id})
        // .cache(MEMBER_CACHE_KEY + id, MEMBER_CACHE_TTL)
        .getOne();
    }

    static async getRepositoryMember(repository_id: number, member_id: number): Promise<RepositoryMember | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(RepositoryMember)
        .createQueryBuilder("repository__member")
        .where("repository__member.member_id= :member_id AND repository__member.repository_id= :repository_id", {repository_id: repository_id, member_id: member_id})
        // .cache(MEMBER_CACHE_KEY + id, MEMBER_CACHE_TTL)
        .getOne();
    }

    static async parseFromGithub(dataList: any): Promise<Member[]> {
        const members = [];
        for (const data of dataList) {
            const username = data.login;
            const avatarUrl = data.avatar_url;

            const member = new Member(username, avatarUrl);
            members.push(member);
        }

        return members;
    }

    static async repositoryMemberBatchCreator(members: Member[], creatorArgs: any): Promise<void> {
      if (!creatorArgs.repository) {
        throw "Argument does not exist: creatorArgs.repository";
      }

      const repository: Repository = creatorArgs.repository;

      // Store all members
      let error = false;
      const connection = Database.getConnection();
      for await (const member of members) {
        try {
          await connection.transaction(async transactionalEntityManager => {
            let newMember = await MemberStore.getMemberByUsername(member.username);
            if(!newMember) {
                newMember = await transactionalEntityManager.save(member);
            }

            let repositoryMember = await MemberStore.getRepositoryMember(repository.id, newMember.id);
            if (!repositoryMember) {
                repositoryMember = new RepositoryMember(repository, newMember);
                await transactionalEntityManager.save(repositoryMember);
            }
          });
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

    static async teamMemberBatchCreator(members: Member[], creatorArgs: any): Promise<void> {
      if (!creatorArgs.team) {
        throw "Argument does not exist: creatorArgs.team";
      }

      const team: Team = creatorArgs.team;

      // Store all members
      let error = false;
      const connection = Database.getConnection();
      for await (const member of members) {
        try {
          await connection.transaction(async transactionalEntityManager => {
            let newMember = await MemberStore.getMemberByUsername(member.username);
            if(!newMember) {
                newMember = await transactionalEntityManager.save(member);
            }

            let teamMember = await MemberStore.getTeamMember(team.id, newMember.id);
            if (!teamMember) {
                teamMember = new TeamMember(team, newMember);
                await transactionalEntityManager.save(teamMember);
            }
          });
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
