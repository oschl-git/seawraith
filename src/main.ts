import express, { Express } from "express";
import fs from "fs";
import https from "https";
import logger from "./utils/logger";
import nunjucks from "nunjucks";
import router from "./router";

main();

function main(): void {
  const app: Express = express();

  app.use(express.urlencoded({ extended: true }));

  app.use(express.static("public"));
  app.use(express.static("src/css"));
  app.use(express.static("src/js"));

  nunjucks.configure("src/views", {
    autoescape: true,
    express: app,
  });

  router(app);
  listen(app);
}

function listen(app: Express): void {
  const useHttps = false;
  // @FIXME make configurable

  // if (useHttps) startHttpsServer(app);
  // else startHttpServer(app);

  startHttpServer(app);
}

function startHttpServer(app: Express): void {
  const port: number = 8484;
  // @FIXME make configurable

  app.listen(port, () => {
    logger.info(`Seawraith successfully started on port ${port}! Yay!`);
    logger.warn(
      "Using HTTP. If running in a production environment, make sure you achieve HTTPS encryption in some other way. " +
        "Never send your credentials over HTTP!",
    );
  });
}

// function startHttpsServer(app: Express): void {
//   const key: string = config.get("https.key");
//   const certificate: string = config.get("https.certificate");

//   const server = https.createServer(
//     {
//       key: fs.readFileSync(key),
//       cert: fs.readFileSync(certificate),
//     },
//     /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
//     app,
//   );

//   server.listen(443, () => {
//     logger.info("Seawraith successfully started on port 443 using HTTPS. Yay!");
//   });
// }
