import express, { Request, Response } from "express";
import { authenticate } from '../authenticator';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const sessionData = authenticate(req);
  res.send(sessionData);
});

export default router;
