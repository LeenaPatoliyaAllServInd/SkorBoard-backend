import DataStore from "@models/datastore.model";
import { CustomError } from "@utils/error";
import { isEqual, sortBy } from "lodash";
import { Pool } from "pg";

const retriveUserDataStoreTemplates = async (userId: any): Promise<any> => {
  try {
    const reportsData = await DataStore.find({
      where: { userId },
    })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error("Error while retrieving report:", err);
        throw err;
      });

    return reportsData;
  } catch (error) {
    console.error("Error while retrieving report:", error);
    throw error;
  }
};

const createNewDataStoreTemplate = async (data: any): Promise<any> => {
  try {
    const constraint = new DataStore();
    constraint.name = data?.name;
    constraint.description = data?.description;
    constraint.userId = data?.userId;

    const report = await constraint.save();

    const tableData = data?.tableData;
    const tableName = `${report?.name?.replace(/ /g, "_")}_${report?.id}_${
      data?.userId
    }`;
    const columns = Object.keys(tableData[0]);

    let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} ( `;
    for (let [index, column] of columns.entries()) {
      if (index !== columns?.length - 1) {
        createTableQuery += column + " VARCHAR(255), ";
      } else {
        createTableQuery += column + " VARCHAR(255) ";
      }
    }
    createTableQuery += ")";

    const pool = getPool();

    const queryResult = await pool
      .query(createTableQuery)
      .then(async (result) => {
        await insertDataIntoDataStore(tableData, tableName);
        return result;
      })
      .catch((err) => {
        pool.end();
        throw err;
      });

    pool.end();

    return constraint;
  } catch (error) {
    console.error("Error while creating report:", error);
    throw error;
  }
};

const updateDataStore = async (data: any): Promise<any> => {
  try {
    const report = await DataStore.findOne({ where: { id: data?.templateId } })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new CustomError("Data store not found", 400);
        }
      })
      .catch((err) => {
        throw err;
      });

    const tableName = `${report?.name?.replace(/ /g, "_")}_${report?.id}_${
      data?.userId
    }`;

    const pool = getPool();

    const query = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
    `;

    const queryResult = await pool
      .query(query, [tableName])
      .then((result) => {
        if (!result?.rowCount) {
          throw new CustomError("Data store not found", 400);
        } else {
          // Extract column names from the result
          const columnNames = result.rows.map((row) => row.column_name);

          const tableColumns = Object.keys(data?.tableData[0]);
          const columnsMatch = isEqual(
            sortBy(columnNames),
            sortBy(tableColumns)
          );

          // Throw error if column names does not match
          if (!columnsMatch) {
            throw new CustomError(
              "Columns does not match with data store",
              400
            );
          }

          // Close the connection pool
          pool.end();

          return result;
        }
      })
      .catch((err) => {
        console.error("Error retrieving column names:", err);
        pool.end(); // Close the connection pool
        throw err;
      });

    const inserQueryResult = await insertDataIntoDataStore(
      data?.tableData,
      tableName
    );
    return {};
  } catch (error) {
    console.error("Error while retrieving report:", error);
    throw error;
  }
};

async function insertDataIntoDataStore(tableData: any, tableName: string) {
  try {
    const pool = getPool();

    const columns = Object.keys(tableData[0]);
    const insertQuery = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES `;
    const values = tableData
      .map(
        (row: any) =>
          `(${columns.map((col) => `'${row[col] || ""}'`).join(", ")})`
      )
      .join(", ");

    const response = await pool
      .query(insertQuery + values)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        pool.end();
        throw err;
      });

    pool.end();

    return response;
  } catch (error) {
    throw error;
  }
}

function getPool(): Pool {
  return new Pool({
    user: "postgres",
    host: "localhost",
    database: "SkorBoard",
    password: "Intra@123",
    port: 5432,
  });
}

export = {
  retriveUserDataStoreTemplates,
  createNewDataStoreTemplate,
  updateDataStore,
};
