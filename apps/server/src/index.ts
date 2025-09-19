import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pg from "pg";
import connectPg from "connect-pg-simple";
import authRouter from "./routes/auth.js";
import { verifyUser } from "./auth.js";
import { ensureDatabase } from "./bootstrap.js";

const PgStore = connectPg(session);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/edumanage";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret";
const PORT = Number(process.env.PORT || 4000);

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// Ensure tables exist on boot
ensureDatabase(pool).catch((e) => {
  console.error("Failed to ensure database:", e);
});

app.use(
  session({
    store: new PgStore({ pool, tableName: "session" }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: "lax" }
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await verifyUser(username, password);
      if (!user) return done(null, false, { message: "Invalid credentials" });
      return done(null, user);
    } catch (e) {
      return done(e as Error);
    }
  })
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

