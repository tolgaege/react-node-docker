module.exports =  {
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    max: 100,
    ssl: true
};