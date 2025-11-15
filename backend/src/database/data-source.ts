import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'welfare_user',
  password: process.env.DATABASE_PASSWORD || 'welfare_pass_2024',
  database: process.env.DATABASE_NAME || 'welfare_db',
  
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  
  migrations: [
    __dirname + '/migrations/*{.ts,.js}',
  ],
  
  logging: true,
  synchronize: false,
};

export const AppDataSource = new DataSource(options);
