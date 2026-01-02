import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const showServerVersionSql = "SHOW server_version;";
  const databaseVersionResult = await database.query(showServerVersionSql);
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const showMaxConnectionsSql = "SHOW max_connections;";
  const databaseMaxConnectionsResult = await database.query(
    showMaxConnectionsSql,
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const selectOpenedConnectionsSql =
    "SELECT count(*)::int from pg_stat_activity where datname= $1;";
  const databaseOpenedConnectionsResult = await database.query({
    text: selectOpenedConnectionsSql,
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    services: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
