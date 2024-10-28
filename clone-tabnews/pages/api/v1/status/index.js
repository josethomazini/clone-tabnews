import query from "infra/database";

export default async function StatusPage(request, response) {
  const databaseName = process.env.POSTGRES_DB;

  const databaseVersionResult = await query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await query("SHOW max_connections;");
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await query({
    text: "SELECT count(*)::int from pg_stat_activity where datname = $1",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
