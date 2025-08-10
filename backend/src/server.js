import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ===== Session middleware (must be above passport) =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Passport Google Strategy =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Later: Save/find user in DB
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ===== Auth routes =====
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? "/" // served by backend in Render
        : "http://localhost:5173"; // your local React dev server

    res.redirect(redirectUrl);
  }
);


app.get("/api/user", (req, res) => {
  res.json(req.user || null);
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// ===== Existing middleware =====
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(rateLimiter);

app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

app.use("/api/notes", notesRoutes);

// ===== Serve frontend in production =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ===== Start server =====
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
