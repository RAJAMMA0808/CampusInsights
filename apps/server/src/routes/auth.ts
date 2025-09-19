import { Router } from "express";
import passport from "passport";
import { z } from "zod";
import { createUser } from "../auth.js";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout(() => res.json({ ok: true }));
});

router.get("/me", (req, res) => {
  res.json({ user: req.user ?? null });
});

router.post("/register", async (req, res, next) => {
  try {
    const body = z
      .object({
        username: z.string().min(3),
        email: z.string().email().optional(),
        password: z.string().min(6),
        role: z.enum(["chairman", "hod", "staff"]),
      })
      .parse(req.body);
    await createUser(body.username, body.email ?? null, body.password, body.role);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

