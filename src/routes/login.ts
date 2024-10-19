import { Router, Request, Response } from "express";
import { authenticate } from '../authenticator';

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("login.njk");
});

router.post("/", (req: Request, res: Response) => {
  authenticate(req, res);
  res.redirect("/files");
});

export default router;
