import { NextFunction, Express, Request, Response } from "express";
import * as flashMessages from "./flash-messages";
import logger from "./logger";

import filesRoute from "./routes/files";
import loginRoute from "./routes/login";
import AuthenticationError from './errors/authenticationError';
import { authenticate } from './authenticator';

export default function route(app: Express) {
  app.use(logRequest);

  app.get("/", (_req: Request, res: Response) => {
    res.redirect("/login");
  });

  app.use("/login", loginRoute);
  app.use("/files", filesRoute);

  app.use((_req: Request, res: Response) => {
    res.status(404).render("error.njk", { errorCode: 404, message: "Not found" });
  });

  app.use(handleAuthenticationError);
  app.use(handleServerError);
}

function logRequest(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.originalUrl} (${req.ip})`);
  next();
}

function handleAuthenticationError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!(err instanceof AuthenticationError)) {
    console.log("hello hello");
    next();
  }

  logger.info(err);

  flashMessages.addMessage(
    { message: err.message, type: flashMessages.Type.Error },
    authenticate(req),
  );
  
  return res.redirect("/login");
}

function handleServerError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(err);

  const message =
    process.env.NODE_ENV === "development" ? err.message + "." : null;

  res.status(500).render("error.njk", { errorCode: 500, message: message });
}
