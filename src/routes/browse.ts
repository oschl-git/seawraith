import express, { Request, Response } from "express";
import { authenticate } from '../authentication';
import * as flashMessages from '../flash-messages';

const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.render("browse.njk", {
    flashMessages: flashMessages.getMessages(req, res),
    sessionData: JSON.stringify(authenticate(req)),
  })
});

export default router;
