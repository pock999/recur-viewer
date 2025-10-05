import { pgClientPool, dbSetting } from '../db/pg-conn.js';

const HierarchyDao = {
  async getTestResultText() {
    const client = await pgClientPool.connect();
    const sql = `SELECT * FROM ${dbSetting.tableName}`;
    const res = await client.query(sql, []);
    return res.rows;
  },
  async getHierarchyList(header) {
    const client = await pgClientPool.connect();
    const sql = `
      WITH RECURSIVE hierarchy_structure AS (
          SELECT
              t1.parent,
              t1.child,
              1 AS level
          FROM
              ${dbSetting.tableName} t1
          WHERE
              t1.parent = $1
          UNION ALL
          SELECT
              t2.parent,
              t2.child,
              t3.level + 1 AS level
          FROM
              ${dbSetting.tableName} t2
          INNER JOIN
              hierarchy_structure t3 ON t2.parent = t3.child
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
  },
};


export default HierarchyDao;