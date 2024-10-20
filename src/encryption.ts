import { SessionCookieData } from "./authenticator";
import * as crypto from "crypto";

const SESSION_ID_LENGTH = 32;

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);

export function encryptSessionData(data: SessionCookieData) {
  const jsonData = JSON.stringify(data);
	
	const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(jsonData, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptSessionData(encryptedData: string): SessionCookieData {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decryptedJson = decipher.update(encryptedData, "hex", "utf8");
  decryptedJson += decipher.final("utf8");
	
	return JSON.parse(decryptedJson) as SessionCookieData;
}

export function generateSessionId(): string {
  return crypto.randomBytes(SESSION_ID_LENGTH).toString("hex");
}