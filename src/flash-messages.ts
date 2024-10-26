import { Request, Response, CookieOptions } from "express";

const FLASH_MESSAGE_COOKIE_NAME = "seawraith_flash";

export enum Type {
  Error = "Error",
  Warning = "Warning",
  Info = "Info",
  Success = "Success",
}

interface FlashMessage {
  type: Type;
  message: string;
}

export function sendMessage(
  type: Type,
  message: string,
  res: Response,
): void {

  const flashMessage: FlashMessage = {
    type: type,
    message: message,
  };

  setFlashMessageCookie(JSON.stringify(flashMessage), res);
}

export function getMessage(req: Request, res: Response): FlashMessage|null {
  let flashMessages: FlashMessage|null = null;

  if (typeof req.cookies[FLASH_MESSAGE_COOKIE_NAME] === "string") {
    flashMessages = JSON.parse(
      req.cookies[FLASH_MESSAGE_COOKIE_NAME],
    ) as FlashMessage;
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
