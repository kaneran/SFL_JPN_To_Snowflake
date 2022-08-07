const snowflake = require("snowflake-sdk");
const fs = require("fs");
require("dotenv").config();

const { ACCOUNT, USER, PASSWORD, DATABASE, SCHEMA } = process.env;

const connection = snowflake.createConnection({
  account: ACCOUNT,
  username: USER,
  password: PASSWORD,
  database: DATABASE,
  schema: SCHEMA,
});

connection.connect((err, conn) => {
  if (err) {
    console.error("Unable to connect: " + err.message);
  } else {
    console.log("Successfully connected to Snowflake.");
  }
});

const readCsv = () => {
  const data = fs.readFileSync("sfv_jpn_matches.csv", "utf8");
  let dataArr = [];
  const results = data.split("\n");
  results.forEach((result) => {
    const data = result.split(",");
    const result_id = parseInt(data[0]);
    const player = data[1];
    const matches_won = parseInt(data[3]);
    const outcome = data[4]?.replace("\r", "");
    const arr = [result_id, player, data[2], matches_won, outcome];
    data[0] !== "" && player !== "Player" && dataArr.push(arr);
  });
  return dataArr;
};

const data = readCsv();
connection.execute({
  sqlText:
    "insert into MATCHRESULTS(RESULT_ID, PLAYER, CHARACTER, MATCHES_WON, OUTCOME) values(?, ?, ?, ?, ?)",
  binds: data,
  complete: (err, stmt, rows) => {
    if (err) {
      console.error(
        "Failed to execute statement due to the following error: " + err.message
      );
    } else {
      console.log("Number of rows produced: " + rows.length);
    }
  },
});
connection.destroy();
