import { Request, Response, CookieOptions } from "express";
import * as encryption from "./encryption";
import * as sftp from "./sftp-connection";
import AuthenticationError from "./errors/authenticationError";
import config from "./config";

const SESSION_COOKIE_NAME = "seawraith_session";
const PERSISTENT_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1 month

export interface SessionCookieData {
  hostname?: string;
  username?: string;
  password: string;
  port?: number;
  path?: string;
  sessionId?: string;
}

export interface SessionData {
  hostname: string;
  username: string;
  password: string;
  port: number;
  path: string;
  sessionId: string;
}

export async function createSession(
  req: Request,
  res: Response,
): Promise<void> {
  const cookieData = req.body as SessionCookieData;
  cookieData.sessionId = encryption.generateSessionId();

  const sessionData = getSessionData(cookieData, req.ip);

  try {
    await sftp.getClientForSession(sessionData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AuthenticationError(
        "Failed connecting to SFTP server",
        "Failed connecting to SFTP server.",
        error,
      );
    }
  }

  const encryptedCookieData = encryption.encryptSessionData(cookieData);
  setSessionCookie(
    res,
    encryptedCookieData,
    ((req.body as Record<string, unknown>)["remember-password"] ?? "off") ===
      "on",
  );
}

export function authenticate(req: Request): SessionData {
  if (
    !req.cookies[SESSION_COOKIE_NAME] ||
    typeof req.cookies[SESSION_COOKIE_NAME] !== "string"
  ) {
    throw new AuthenticationError("Could not obtain authentication cookie");
  }

  let cookieData: SessionCookieData;
  try {
    cookieData = encryption.decryptSessionData(
      req.cookies[SESSION_COOKIE_NAME],
    );
  } catch (e) {
    throw new AuthenticationError(
      "Could not decrypt authentication cookie",
      "Error while obtaining authentication data from the client",
      e,
    );
  }

  return getSessionData(cookieData, req.ip);
}

function getSessionData(
  cookieData: SessionCookieData,
  ip?: string,
): SessionData {
  if (!ip) {
    throw new AuthenticationError("Could not access IP address");
  }

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
      undefined,
    );
  }

  if (config.forcePath) cookieData.path = config.forcePath;
  if (!cookieData.path) {
    cookieData.path = "/";
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
    sessionId: ip + cookieData.sessionId,
  };
}

function setSessionCookie(
  res: Response,
  value: string,
  persistent = true,
): void {
  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  };

  if (persistent) {
    cookieOptions.maxAge = PERSISTENT_COOKIE_MAX_AGE;
  }

  res.cookie(SESSION_COOKIE_NAME, value, cookieOptions);
}
