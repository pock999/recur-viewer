import { pgClientPool, dbSetting } from '../db/pg-conn.js';

const InfoDao = {
  async getInfoByKey(key) {

    const searchList = [];
    if(Array.isArray(key)) {
      searchList.push(...key);
    } else {
      searchList.push(key);
    }

    if(searchList.length === 0) {
      return [];
    }

    const client = await pgClientPool.connect();

    const placeholders = searchList.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      SELECT * FROM ${dbSetting.infoTableName}
      WHERE ${dbSetting.infoTableKey} IN (${placeholders})
    `;

    const res = await client.query(sql, [...searchList]);
    return res.rows;
  },
};

export default InfoDao;