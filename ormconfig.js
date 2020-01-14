module.exports = [
  {
    name: "default",
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: process.env.POSTGRES_SSL || undefined,
    logging: process.env.POSTGRES_LOGGING || true,
    synchronize: false,
    migrationsTableName: "orm_migration",
    migrations: ["dist/database/migration/**/*.js"],
    entities: ["dist/database/entity/**/*.js"],
    subscribers: ["dist/database/subscriber/**/*.js"],
    cli: {
      entitiesDir: "src/database/entity",
      migrationsDir: "src/database/migration",
      subscribersDir: "src/database/subscriber",
    },
    cache: {
      type: "redis",
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
      duration: 1000 * 3, // 3 seconds
    },
  },
];
