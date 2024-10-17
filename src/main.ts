import config from "config";
import express, { Express, Request, Response } from "express";
import fs from "fs";
import https from "https";
import logger from "./utils/logger";

main();

function main(): void {
  const app: Express = express();

  app.get("/", (req: Request, res: Response) => {
    res.send("hello");
  });

  listen(app);
}

function listen(app: Express): void {
  const useHttps: boolean = config.get("https.use");

  if (useHttps) startHttpsServer(app);
  else startHttpServer(app);
}

function startHttpServer(app: Express): void {
  const port: number = config.get("port");

  app.listen(port, () => {
    logger.info(`Seawraith successfully started on port ${port}! Yay!`);
    logger.warn(
      "Using HTTP. If running in a production environment, make sure you achieve HTTPS encryption in some other way. " +
        "Never send your credentials over HTTP!",
    );
  });
}

function startHttpsServer(app: Express): void {
  const key: string = config.get("https.key");
  const certificate: string = config.get("https.certificate");

  const server = https.createServer(
    {
      key: fs.readFileSync(key),
      cert: fs.readFileSync(certificate),
    },
    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
    app,
  );

  server.listen(443, () => {
    logger.info("Seawraith successfully started on port 443 using HTTPS. Yay!");
  });
}
