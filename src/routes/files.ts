import express, { Request, Response } from "express";
import { authenticate } from '../authenticator';
import { getClientForSession } from '../sftp-connection';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const sessionData = authenticate(req);
  res.send(getClientForSession(sessionData));
});

export default router;
