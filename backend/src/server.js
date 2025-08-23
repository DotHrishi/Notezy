import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: "notezy.sid", // Custom session name
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy!!", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  (req, res) => {
    console.log("Auth callback - User:", req.user);
    console.log("Auth callback - Session:", req.session);

    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? "/"
        : "http://localhost:5173";

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect("/login?error=session");
      }
      console.log("Session saved successfully, redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    });
  }
);

app.get("/api/user", (req, res) => {
  console.log("User endpoint - Session:", req.session);
  console.log("User endpoint - User:", req.user);
  console.log("User endpoint - Session ID:", req.sessionID);

  // For local development, return mock user
  if (process.env.NODE_ENV !== "production") {
    return res.json({
      id: "dev-user-id",
      name: "Dev User",
      email: "dev@example.com",
      avatar: "https://via.placeholder.com/150",
      googleId: "dev-google-id",
    });
  }

  if (req.user) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      googleId: req.user.googleId,
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to logout!" });
    }
    req.session.destroy(() => {
      res.clearCookie("notezy.sid");
      res.json({ message: "Logged out successfully!" });
    });
  });
});


app.post("/api/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: "Failed to logout!" });
    }
    req.session.destroy(() => {
      res.clearCookie("notezy.sid");
      res.json({ message: "Logged out successfully!" });
    });
  });
});


app.use(rateLimiter);

app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

app.use("/api/notes", notesRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
