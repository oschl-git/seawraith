import { Router, Request, Response } from "express";
import { createSession } from "../authenticator";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  throw new Error("Bitch please");
  res.render("login.njk");
});

router.post("/", async (req: Request, res: Response) => {
  await createSession(req, res);
  res.redirect("/files");
});

export default router;
