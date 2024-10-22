import express, { Request, Response } from "express";
import { authenticate } from '../authentication';

const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  const sessionData = authenticate(req);
  res.send(sessionData);
});

export default router;
