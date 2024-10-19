import express, { Request, Response } from "express";
import { getSessionData } from '../authenticator';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send(getSessionData(req));
});

export default router;
