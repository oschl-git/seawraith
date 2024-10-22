import { Request, Response, CookieOptions } from "express";

const FLASH_MESSAGE_COOKIE_NAME = "seawraith_flash";

export enum Type {
  Error,
  Warning,
  Info,
  Success,
}

interface FlashMessage {
  type: Type;
  message: string;
}

export function addMessage(
  type: Type,
  message: string,
  req: Request,
  res: Response,
): void {
  const flashMessages = getMessages(req, res);

  flashMessages.push({
    type: type,
    message: message,
  });

  setFlashMessageCookie(JSON.stringify(flashMessages), res);
}

export function getMessages(req: Request, res: Response): FlashMessage[] {
  let flashMessages: FlashMessage[] = [];

  if (typeof req.cookies[FLASH_MESSAGE_COOKIE_NAME] === "string") {
    flashMessages = JSON.parse(
      req.cookies[FLASH_MESSAGE_COOKIE_NAME],
    ) as FlashMessage[];
  }

  deleteFlashMessageCookie(res);

  return flashMessages;
}

function setFlashMessageCookie(value: string, res: Response): void {
  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  };

  res.cookie(FLASH_MESSAGE_COOKIE_NAME, value, cookieOptions);
}

function deleteFlashMessageCookie(res: Response): void {
  const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0,
  };

  res.cookie(FLASH_MESSAGE_COOKIE_NAME, "[]", cookieOptions);
}
