import {User} from "../entity/User";
import Database from "../Database";
import {DeleteResult, UpdateResult} from "typeorm";
import Cache from "../../cache/Cache";
import logger from "../../util/logger";

// export const ORGANIZATION_CACHE_KEY = 'User:'
// export const ORGANIZATION_CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

// https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md Check this

export class UserStore {

    static async create(username: string, installationId: number, name?: string, email?: string): Promise<User> {
        const user = new User(username, installationId, name, email);
        const connection = Database.getConnection();
        return await connection.getRepository(User).save(user);
    }

    static async getUserById(id: number): Promise<User | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id= :value", {value: id})
        // .cache(ORGANIZATION_CACHE_KEY + id, ORGANIZATION_CACHE_TTL)
        .getOne();
    }

    static async getUserByUsername(username: string): Promise<User | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(User)

        .createQueryBuilder("user")
        .where("user.username= :value", {value: username})
        // .cache(ORGANIZATION_CACHE_KEY + username, ORGANIZATION_CACHE_TTL)
        .getOne();
    }

    static async getAllUsers(): Promise<User[] | undefined> {
        const connection = Database.getConnection();
        return await connection
        .getRepository(User)
        .createQueryBuilder("user")
        // .cache(ORGANIZATION_CACHE_KEY + username, ORGANIZATION_CACHE_TTL)
        .getMany();
    }

    // static async getUserByEmail(email: string): Promise<User | undefined> {
    //     const connection = Database.getConnection()
    //     return await connection
    //     .getRepository(User)
    //     .createQueryBuilder('user')
    //     .where('user.email= :value', {value: email})
    //     .leftJoinAndSelect('user.expansions', 'expansion')
    //     .getOne()
    // }

    // static async update(modifiedUser: User): Promise<User> {
    //     const user = await this.getUserById(modifiedUser.id)
    //     if(!user) {
    //         // Throw error here
    //         return Promise.reject()
    //     }

    //     const connection = Database.getConnection()
    //     const res = await connection.getRepository(User).save(modifiedUser)
    //     Cache.del(ORGANIZATION_CACHE_KEY + user.id)
    //     return res
    // }

    // static async isUsernameAvailable(username: string): Promise<boolean> {
    //     // Assumption: username sent here does not contain spaces or any weird characters
    //     const connection = Database.getConnection()
    //     const res = await connection
    //     .getRepository(User)
    //     .createQueryBuilder('user')
    //     .where('LOWER(user.username)= LOWER(:value)', {value: username})
    //     .getOne()
    //     return !res
    // }

    // // Example code for query version of update
    // static async updateUsername(id: number, username: string): Promise<UpdateResult> {
    //     const connection = Database.getConnection()
    //     const res = await connection
    //     .createQueryBuilder()
    //     .update(User)
    //     .set({username: username})
    //     .where('id = :id', {id: id})
    //     .execute()
    //     Cache.del(ORGANIZATION_CACHE_KEY + id)
    //     return res
    // }

    // static async delete(id: number): Promise<DeleteResult> {
    //     const connection = Database.getConnection()
    //     const user = await this.getUserById(id)
    //     if(!user) {
    //         // Throw error here
    //         return Promise.reject()
    //     }

    //     const res = await connection.getRepository(User).delete(user.id)
    //     Cache.del(ORGANIZATION_CACHE_KEY + id)
    //     return res
    // }

    // static async upgradeGuestToUser(userId: number, email: string): Promise<User | undefined> {
    //     const user = await User.getUserById(userId)
    //     if(!user) {
    //         Promise.reject('Token does not have a user attached')
    //         return
    //     }
    //     user.email = email
    //     user.accessLevel = AccessLevel.User

    //     if(hasUsernameTag(user.username)) {
    //         user.username = removeUsernameTag(user.username)
    //     }

    //     const res = await User.update(user)
    //     Cache.del(ORGANIZATION_CACHE_KEY + user.id)
    //     return res
    // }

    // static async upgradeToAdmin(userId: number, newUsername: string): Promise<User | undefined> {
    //     const user = await User.getUserById(userId)
    //     if(!user) {
    //         Promise.reject('Token does not have a user attached')
    //         return
    //     }
    //     user.username = newUsername
    //     user.accessLevel = AccessLevel.Administrator

    //     const res = await User.update(user)
    //     Cache.del(ORGANIZATION_CACHE_KEY + user.id)
    //     return res
    // }

    // static async addExpansion(expansion: ExpansionType, user: User, isGift: boolean): Promise<ExpansionEntity> {
    //     const expansionEntity = new ExpansionEntity(expansion, user, isGift)
    //     const connection = Database.getConnection()
    //     const result = await connection.manager.save(expansionEntity)
    //     Cache.del(ORGANIZATION_CACHE_KEY + user.id)
    //     return result
    // }

    // static async updateUserStats(user: User) {
    //     const organization = await User.getUserById(user.id)
    //     if(!organization) return logger.info(user.id + ' does not have a user in database')
    //     organization.passedTutorial = user.passedTutorial
    //     organization.completedGames = user.karma.completedGames
    //     await User.update(organization)
    //     Cache.del(ORGANIZATION_CACHE_KEY + organization.id)
    // }

}
