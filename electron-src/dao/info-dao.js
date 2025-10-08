import { pgClientPool, recurViewConfig } from "../db/pg-conn.js";

const InfoDao = {
  async getInfoByKey(key) {
    const searchList = [];
    if (Array.isArray(key)) {
      searchList.push(...key);
    } else {
      searchList.push(key);
    }

    if (searchList.length === 0) {
      return [];
    }

    let client;
    try {
      client = await pgClientPool.connect();

      const placeholders = searchList.map((_, i) => `$${i + 1}`).join(", ");

      const sql = `
        SELECT * FROM ${recurViewConfig.infoTableName}
        WHERE ${recurViewConfig.infoTableKey} IN (${placeholders})
      `;

      const res = await client.query(sql, [...searchList]);
      return res.rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      // 3. 關鍵！無論成功或失敗，都必須釋放連線
      if (client) {
        client.release();
      }
    }
  },
};

export default InfoDao;
