// import * as dotenv from 'dotenv';

// import { DataSource } from 'typeorm';
const dotenv = require('dotenv');
const { createConnection } = require('typeorm');

dotenv.config();

const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + '/src/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
};

module.exports = createConnection(typeOrmConfig);
