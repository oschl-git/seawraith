import { NextFunction, Express, Request, Response } from "express";
import logger from "./logger";

import filesRoute from "./routes/files";
import loginRoute from "./routes/login";

export default function route(app: Express) {
  app.use(logRequest);

  app.get("/", (req: Request, res: Response) => {
    res.redirect("/login");
  });

  app.use("/login", loginRoute);
  app.use("/files", filesRoute);

  app.all("*", (req: Request, res: Response) => {
    res.redirect("/");
  });

  app.use(handleServerError);
}

function logRequest(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.originalUrl} (${req.ip})`);
  next();
}

function handleServerError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err);

  const message =
    process.env.NODE_ENV === "development" ? err.message + "." : null;

  res.status(500).render("error.njk", { errorCode: 500, message: message });
  next();
}
