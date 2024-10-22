import { createSession } from "../authentication";
import { Router, Request, Response } from "express";
import * as flashMessages from "../flash-messages";

const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.render("login.njk", {
    flashMessages: flashMessages.getMessages(req, res),
  });
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  await createSession(req, res);
  res.redirect("/files");
});

export default router;
