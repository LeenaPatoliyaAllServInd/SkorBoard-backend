import Report from "@models/report.model";
import { CustomError } from "@utils/error";
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SkorBoard",
  password: "Intra@123",
  port: 5432, // Default PostgreSQL port
});

const retriveUserReports = async (userId: any): Promise<any> => {
  try {
    const reportsData = await Report.find({
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

const createNewReport = async (data: any): Promise<any> => {
  try {
    await Report.find({
      where: { name: data?.name, userId: data?.userId },
    })
      .then((result) => {
        if (result?.length) {
          throw new CustomError(
            "Report with provided name already exists",
            400
          );
        }
      })
      .catch((err) => {
        console.error("Error while creating report:", err);
        throw err;
      });

    const constraint = new Report();
    constraint.name = data?.name;
    constraint.description = data?.description;
    constraint.userId = data?.userId;

    await constraint.save();

    const tableData = data?.tableData;
    const tableName = `${data?.name?.replace(/ /g, "_")}_${data?.userId}`;
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

    pool.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        return;
      }

      if (result.command === "CREATE") {
        console.log("Table created successfully");
      } else {
        console.log("Table already exists");
      }

      pool.end();
    });

    return constraint;
  } catch (error) {
    console.error("Error while creating report:", error);
    throw error;
  }
};

export = {
  retriveUserReports,
  createNewReport,
};
