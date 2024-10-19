import { Request, Response, CookieOptions } from "express";
import config from "./config";
import AuthenticationError from "./errors/authenticationError";

const HOSTNAME_COOKIE_NAME = "seawraith_hostname";
const USERNAME_COOKIE_NAME = "seawraith_username";
const PASSWORD_COOKIE_NAME = "seawraith_password";
const PORT_COOKIE_NAME = "seawraith_port";
const PATH_COOKIE_NAME = "seawraith_path";

const PERSISTENT_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1 month

export interface SessionData {
  hostname: string;
  username: string;
  password: string;
  port: number;
  path?: string;
}

export function authenticate(req: Request, res: Response): void {
  const sessionData = req.body as SessionData;

  if (sessionData.hostname) {
    setCookie(res, HOSTNAME_COOKIE_NAME, sessionData.hostname);
  }

  if (sessionData.username) {
    setCookie(res, USERNAME_COOKIE_NAME, sessionData.username);
  }

  if (sessionData.password) {
    setCookie(res, PASSWORD_COOKIE_NAME, sessionData.password);
  }

  if (sessionData.port) {
    setCookie(res, PORT_COOKIE_NAME, String(sessionData.port));
  }

  if (sessionData.path) {
    setCookie(res, PATH_COOKIE_NAME, sessionData.path);
  }
}

export function getSessionData(req: Request): SessionData {
  let hostname: string;
  if (config.forceHostname) {
    hostname = config.forceHostname;
  } else if (typeof req.cookies[HOSTNAME_COOKIE_NAME] === "string") {
    hostname = req.cookies[HOSTNAME_COOKIE_NAME];
  } else {
    throw new AuthenticationError("Could not obtain hostname");
  }

  let username: string;
  if (config.forceUsername) {
    username = config.forceUsername;
  } else if (typeof req.cookies[USERNAME_COOKIE_NAME] === "string") {
    username = req.cookies[USERNAME_COOKIE_NAME];
  } else {
    throw new AuthenticationError("Could not obtain username");
  }

  let password: string;
  if (typeof req.cookies[PASSWORD_COOKIE_NAME] === "string") {
    password = req.cookies[PASSWORD_COOKIE_NAME];
  } else {
    throw new AuthenticationError("Could not obtain password");
  }

  let port: number;
  if (config.forcePort) {
    port = config.forcePort;
  } else if (typeof req.cookies[PORT_COOKIE_NAME] === "number") {
    port = req.cookies[PORT_COOKIE_NAME];
  } else {
    throw new AuthenticationError("Could not obtain port");
  }

  let path: string|undefined;
  if (config.forcePath) {
    path = config.forcePath;
  } else if (typeof req.cookies[PATH_COOKIE_NAME] === "string") {
    path = req.cookies[PATH_COOKIE_NAME];
  } else {
    path = undefined;
  }

  return {
    hostname,
    username,
    password,
    port,
    path,
  };
}

function setCookie(
  res: Response,
  name: string,
  value: string,
  persistent = true,
) {
  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  };

  if (persistent) {
    cookieOptions.maxAge = PERSISTENT_COOKIE_MAX_AGE;
  }

  res.cookie(name, value, cookieOptions);
}
