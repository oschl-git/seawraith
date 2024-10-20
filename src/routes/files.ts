import express, { Request, Response } from "express";
import { authenticate } from '../authenticator';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send(authenticate(req));
});

export default router;
