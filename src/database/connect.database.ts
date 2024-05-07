import { DataSource, Entity } from 'typeorm';

import User from "@models/user.model"
import DataStore from '@models/datastore.model';

let cachedDataSource: DataSource | null = null;

const createDatabaseConnection = async (): Promise<DataSource> =>{
    const databaseConfig: any = {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'Intra@123',
        database: 'SkorBoard',
        synchronize: true,
        ssl: false,
        entities: {
            User, DataStore
        }
    }
    const AppDataSource = new DataSource(databaseConfig);
    await AppDataSource.initialize();
    cachedDataSource = AppDataSource;
    return cachedDataSource;
}

export default createDatabaseConnection;