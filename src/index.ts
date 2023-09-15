import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";
import * as path from "path";
import dotenv from "dotenv";
import { initMongoose } from "./mongoose/init";
import { indexRouter } from "./routes";

// load env
dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is required.");
}

initMongoose(process.env.MONGO_URL);
main();

function main() {
  const app = express();

  //body parser
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  //  setting up view path and extension
  app.set("views", path.join(__dirname, "../", "views"));
  app.set("view engine", "njk");

  // Serving static files
  app.use(
    "/public",
    express.static(path.join(__dirname, "../", "public"), {
      index: false,
      lastModified: false,
    })
  );

  // setting up template engine
  nunjucks.configure("views", {
    autoescape: true,
    express: app,
    dev: process.env.NODE_ENV === "development",
    watch: process.env.NODE_ENV === "development",
  });

  // adding routes
  app.use(indexRouter);

  // path not found handler
  app.use("*", (req: Request, res: Response) => {
    res.render("error/errorPage", { error: "404", message: "Page not found" });
  });

  // GLobal error handler
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.render("error/errorPage", { error: "Internal Server Error", message: error.message });
  });

  app.listen(8080, () => {
    console.log("Listening on port 8080");
  });
}
