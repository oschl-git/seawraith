import config from "./config";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import fs from "fs";
import https from "https";
import logger from "./logger";
import nunjucks from "nunjucks";
import router from "./router";

main();

function main(): void {
  const app: Express = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  nunjucks.configure("src/views", {
    autoescape: true,
    express: app,
  });

  app.use(express.static("src/public"));

  router(app);
  listen(app);
}

function listen(app: Express): void {
  if (config.https.use) startHttpsServer(app);
  else startHttpServer(app);
}

function startHttpServer(app: Express): void {
  app.listen(config.port, () => {
    logger.info(`Seawraith successfully started on port ${config.port}! Yay!`);
    logger.warn(
      "Using HTTP. If running in a production environment, make sure you achieve HTTPS encryption in some other way. " +
        "Never send your credentials over HTTP!",
    );
  });
}

function startHttpsServer(app: Express): void {
  const server = https.createServer(
    {
      key: fs.readFileSync(config.https.keyPath),
      cert: fs.readFileSync(config.https.keyPath),
    },
    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
    app,
  );

  server.listen(443, () => {
    logger.info("Seawraith successfully started on port 443 using HTTPS. Yay!");
  });
}
