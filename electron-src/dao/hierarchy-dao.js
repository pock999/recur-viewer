import { pgClientPool, recurViewConfig } from "../db/pg-conn.js";

const HierarchyDao = {
  async getHierarchyList(header) {
    let client;
    try {
      client = await pgClientPool.connect();
      const sql = `
        WITH RECURSIVE hierarchy_structure AS (
            SELECT
                t1.${recurViewConfig.hierarchyKey.parentCol} as parent,
                t1.${recurViewConfig.hierarchyKey.childCol} as child,
                1 AS level
            FROM
                ${recurViewConfig.tableName} t1
            WHERE
                t1.${recurViewConfig.hierarchyKey.parentCol} = $1
            UNION ALL
            SELECT
                t2.${recurViewConfig.hierarchyKey.parentCol} as parent,
                t2.${recurViewConfig.hierarchyKey.childCol} as child,
                t3.level + 1 AS level
            FROM
                ${recurViewConfig.tableName} t2
            INNER JOIN
                hierarchy_structure t3 ON 
                t2.${recurViewConfig.hierarchyKey.parentCol} = t3.${recurViewConfig.hierarchyKey.childCol}
        )
        SELECT
            parent,
            child,
            level
        FROM
            hierarchy_structure
        ORDER BY level asc, parent, child;
      `;

      const res = await client.query(sql, [header]);
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

export default HierarchyDao;
