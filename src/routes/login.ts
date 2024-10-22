import { authenticate, createSession } from "../authenticator";
import { Router, Request, Response } from "express";
import * as flashMessages from "../flash-messages";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("login.njk", {
    flashMessages: flashMessages.getMessages(req, res),
  });
});

router.post("/", async (req: Request, res: Response) => {
  await createSession(req, res);
  res.redirect("/files");
});

export default router;
