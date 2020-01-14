import { Connection, createConnection } from "typeorm";
import logger from "../util/logger";

export default class Database {
    private static connection: Connection

    static async init(): Promise<any> {
      try {
        Database.connection = await createConnection();
        logger.info("✅ PostgreSQL: Connection Succeeded");
        return Database.connection;
      } catch (e) {
        throw Error(`❌ PostgreSQL: Database Connection Failed ${e}`);
      }
    }

    static async initTestDb() {
      try {
        Database.connection = await createConnection("testdb");

        logger.info(`✅ Test PostgreSQL: Connection Succeeded ${process.env.POSTGRES_HOST}`);
      } catch (e) {
        throw Error(`❌ PostgreSQL: Test Database Connection Failed ${e}`);
      }
    }

    static getConnection(): Connection {
      return Database.connection;
    }

    static shutdown(): Promise<any> {
      logger.info("PostgreSQL: Shutting down..");
      return Database.connection.close();
    }

    static query(query: string): Promise<any> {
        return Database.connection.manager.query(query);
    }
}
