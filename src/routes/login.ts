import express, { Request, Response } from "express";

const router = express.Router();

interface LoginData {
  hostname: string;
  username: string;
  password: string;
}

router.get("/", (req: Request, res: Response) => {
  res.render("login.njk");
});

router.post("/", (req: Request, res: Response) => {
  const loginData = req.body as LoginData;
  
  res.send(loginData.username);
});

export default router;
