import { pgClientPool } from '../db/pgConn.js';

const BomDao = {
  async getTestResultText() {
    const client = await pgClientPool.connect();
    const sql = 'SELECT * FROM public.bom';
    const res = await client.query(sql, []);
    return res.rows;
  },
};


export default BomDao;