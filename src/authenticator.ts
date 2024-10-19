import { Request, Response, CookieOptions } from "express";

const HOSTNAME_COOKIE_NAME = "seawraith_hostname";
const USERNAME_COOKIE_NAME = "seawraith_username";
const PASSWORD_COOKIE_NAME = "seawraith_password";
const PORT_COOKIE_NAME = "seawraith_port";
const PATH_COOKIE_NAME = "seawraith_path";

const PERSISTENT_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1 month

export interface LoginData {
  hostname: string | null;
  username: string | null;
  password: string | null;
  port: number | null;
  path: string | null;
}

export function authenticate(req: Request, res: Response): void {
  const loginData = req.body as LoginData;

  console.log(loginData.port);

  if (loginData.hostname) {
    setCookie(res, HOSTNAME_COOKIE_NAME, loginData.hostname);
  }

  if (loginData.username) {
    setCookie(res, USERNAME_COOKIE_NAME, loginData.username);
  }

  if (loginData.password) {
    setCookie(res, PASSWORD_COOKIE_NAME, loginData.password);
  }

  if (loginData.port) {
    setCookie(res, PORT_COOKIE_NAME, String(loginData.port));
  }

  if (loginData.path) {
    setCookie(res, PATH_COOKIE_NAME, loginData.path);
  }
}

function setCookie(res: Response, name: string, value: string, persistent = true) {
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
