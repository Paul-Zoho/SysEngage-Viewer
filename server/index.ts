import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { storage } from "./storage";

interface SessionUser {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "50mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.text({ limit: "50mb", type: ["text/plain", "text/markdown"] }));
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const MemoryStoreSession = MemoryStore(session);

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.warn("[auth] WARNING: SESSION_SECRET is not set — using insecure fallback");
}

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: SESSION_SECRET || "dev-fallback-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.warn("[auth] WARNING: ADMIN_USERNAME/ADMIN_PASSWORD not set — UI login will not work");
}

passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return done(null, false, { message: "Admin credentials not configured" });
    }
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const user: SessionUser = { id: "admin", username };
      return done(null, user);
    }
    return done(null, false, { message: "Invalid username or password" });
  }),
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  if (id === "admin") {
    const user: SessionUser = { id: "admin", username: ADMIN_USERNAME || "admin" };
    done(null, user);
  } else {
    done(null, false);
  }
});

const API_SECRET_KEY = process.env.API_SECRET_KEY;
if (!API_SECRET_KEY) {
  console.warn("[auth] WARNING: API_SECRET_KEY is not set — external API access is unprotected");
}

app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/auth/")) return next();

  if (req.isAuthenticated()) return next();

  if (API_SECRET_KEY) {
    const authHeader = req.headers["authorization"];
    const apiKeyHeader = req.headers["x-api-key"];
    const bearerToken =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const providedKey = bearerToken || apiKeyHeader;
    if (providedKey && providedKey === API_SECRET_KEY) return next();
  }

  if (!API_SECRET_KEY && !ADMIN_USERNAME) return next();

  return res.status(401).json({ message: "Unauthorized" });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  await storage.initialize();

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const origExit = process.exit;
    process.exit = function (code?: number) {
      if (code === 1) {
        console.warn("Suppressed process.exit(1) from Vite error logger");
        return undefined as never;
      }
      return origExit(code);
    } as typeof process.exit;

    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );

})();
