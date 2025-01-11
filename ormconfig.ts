import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import mysql from 'mysql2';
import { join } from 'path';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    driver: mysql,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'develcode',
    entities: [
        join(__dirname, '**/entities/*.entity.{ts,js}'),
    ],
    migrations: [
        join(__dirname, 'src/app/migrations/*.{ts,js}')
    ],
    synchronize: false,
});

export default AppDataSource;
