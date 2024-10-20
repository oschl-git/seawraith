import { Request, Response, CookieOptions } from "express";
import config from "./config";
import AuthenticationError from "./errors/authenticationError";
import { encryptSessionData, decryptSessionData, generateSessionId } from "./encryption";

const SESSION_COOKIE_NAME = "seawraith_session";
const PERSISTENT_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1 month

export interface SessionCookieData {
  hostname?: string;
  username?: string;
  password: string;
  port?: number;
  path?: string;
  ip?: string;
  sessionId?: string;
}

export interface SessionData {
  hostname: string;
  username: string;
  password: string;
  port: number;
  path: string;
  ip: string;
  sessionId: string;
}

export function createSessionCookie(req: Request, res: Response): void {
  const sessionData = req.body as SessionCookieData;
  sessionData.ip = req.ip;
  sessionData.sessionId = generateSessionId();

  const encryptedCookieData = encryptSessionData(sessionData);

  setCookie(
    res,
    SESSION_COOKIE_NAME,
    encryptedCookieData,
    req.cookies.rememberPassword === "true" ? true : false, // @FIXME This will probably not work lol
  );
}

export function authenticate(req: Request): SessionData {
  if (typeof req.cookies[SESSION_COOKIE_NAME] !== "string") {
    throw new AuthenticationError("Could not obtain authentication cookie");
  }

  const sessionData = decryptSessionData(req.cookies[SESSION_COOKIE_NAME]);
  return getSessionData(sessionData);
}

function getSessionData(cookieData: SessionCookieData): SessionData {
  if (!cookieData.password) {
    throw new AuthenticationError(
      "Could not obtain password during authentication",
    );
  }

  if (config.forceHostname) cookieData.hostname = config.forceHostname;
  if (typeof cookieData.hostname === "undefined") {
    throw new AuthenticationError(
      "Could not obtain hostname during authentication",
    );
  }

  if (config.forceUsername) cookieData.username = config.forceUsername;
  if (!cookieData.username) {
    throw new AuthenticationError(
      "Could not obtain username during authentication",
    );
  }

  if (config.forcePort) cookieData.port = config.forcePort;
  if (!cookieData.port) {
    throw new AuthenticationError(
      "Could not obtain port during authentication",
    );
  }

  if (config.forcePath) cookieData.path = config.forcePath;
  if (!cookieData.path) {
    cookieData.path = "/";
  }

  if (!cookieData.ip) {
    throw new AuthenticationError(
      "Could not obtain IP address during authentication",
    );
  }

  if (!cookieData.ip) {
    throw new AuthenticationError(
      "Could not obtain IP address during authentication",
    );
  }

  if (!cookieData.sessionId) {
    throw new AuthenticationError(
      "Could not obtain session ID during authentication",
    );
  }

  return {
    hostname: cookieData.hostname,
    username: cookieData.username,
    password: cookieData.password,
    port: cookieData.port,
    path: cookieData.path,
    ip: cookieData.ip,
    sessionId: cookieData.sessionId,
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
