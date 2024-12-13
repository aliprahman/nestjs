import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./src/databases/entities/*.entity.js'],
  logging: process.env.ENV == 'development',
  synchronize: false,
  migrations: ['./src/databases/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

const AppDataSource = new DataSource(options);
AppDataSource.initialize();
export default AppDataSource;
