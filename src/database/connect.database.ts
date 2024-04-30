import { DataSource, Entity } from 'typeorm';

import User from "@models/user.model"

let cachedDataSource: DataSource | null = null;

const createDatabaseConnection = async (): Promise<DataSource> =>{
    const databaseConfig: any = {
        type: 'postgres',
        host: 'localhost',
        port: 3001,
        username: 'postgres',
        password: 'Intra@123',
        database: 'SkorBoard',
        synchronize: true,
        ssl: false,
        entities: {
            User
        }
    }
    const AppDataSource = new DataSource(databaseConfig);
    await AppDataSource.initialize();
    cachedDataSource = AppDataSource;
    return cachedDataSource;
}

export default createDatabaseConnection;