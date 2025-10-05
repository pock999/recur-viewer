import { Pool } from 'pg';
import dbConfig from '../config/db-config.json' with { type: 'json' };

export const pgClientPool = new Pool({...dbConfig});