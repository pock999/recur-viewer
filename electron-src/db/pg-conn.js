import { Pool } from 'pg';
import dbConfig from '../../shared/config/db-config.json' with { type: 'json' };

export const pgClientPool = new Pool({...dbConfig.db});
export const recurViewConfig = dbConfig.recurViewConfig;