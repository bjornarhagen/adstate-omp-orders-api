import dotenv from "dotenv";
import express from "express";
import { createPool } from "mysql";
import cors from "cors";
import { db } from "@bjornarhagen/db_js";

dotenv.config();

const connectionPool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();
const port = process.env.APP_PORT;

app.use(cors());

app.get("/", (req, res) => {
  db(connectionPool)
    .select("SELECT id, firstname, lastname FROM order_ LIMIT 10")
    .then((queryResult) => {
      res.send(queryResult);
    })
    .catch(() => res.send("Error"));
});

app.get("/:orderId", (req, res) => {
  if (!isNaN(req.params.orderId)) {
    db(connectionPool)
      .select("SELECT * FROM order_ WHERE id = ?", [req.params.orderId])
      .then((queryResult) => {
        res.send(queryResult[0]);
      })
      .catch(() => res.send("Error"));
  } else {
    res.status(422).json({ error: "Missing parameters" });
  }
});

app.listen(port, () => {
  console.log(`App started listening at http://localhost:${port}`);
});
