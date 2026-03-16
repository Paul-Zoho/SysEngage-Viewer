import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { parseLedgerMarkdown, parseJsonLedger } from "./ledgerParser";
import { getNeonDb } from "./neonDb";
import { importLedgerToNeon, appendLedgerToNeon, mergeLedgerJsonb } from "./neonImport";
import * as neonStorage from "./neonStorage";
import * as fs from "fs";
import * as path from "path";

async function getActiveProjectId(): Promise<string> {
  return storage.getActiveProjectId();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const db = getNeonDb();

  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (loginErr: any) => {
        if (loginErr) return next(loginErr);
        return res.json({ user: { username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: any) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ user: { username: user.username } });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  app.get("/api/ledger", async (_req, res) => {
    res.json(await storage.getLedger());
  });

  app.get("/api/ledger/stats", async (_req, res) => {
    const pid = await getActiveProjectId();
    const result = await neonStorage.getStats(db, pid);
    res.json(result);
  });

  app.get("/api/ledger/sources", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "sources"));
  });

  app.get("/api/ledger/requirements", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "requirements"));
  });

  app.get("/api/ledger/findings", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "findings"));
  });

  app.get("/api/ledger/gaps", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "gaps"));
  });

  app.get("/api/ledger/risks", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "risks"));
  });

  app.get("/api/ledger/issues", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "issues"));
  });

  app.get("/api/ledger/traces", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "traces"));
  });

  app.get("/api/ledger/decisions", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "decisions"));
  });

  app.get("/api/ledger/domains", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "domains"));
  });

  app.get("/api/ledger/coverage", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "coverage_items"));
  });

  app.get("/api/ledger/rules", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "rules"));
  });

  app.get("/api/ledger/questions", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "questions"));
  });

  app.get("/api/ledger/assumptions", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "assumptions"));
  });

  app.get("/api/ledger/constraints", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "constraints"));
  });

  app.get("/api/ledger/stakeholders", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "stakeholders"));
  });

  app.get("/api/ledger/segments", async (_req, res) => {
    const pid = await getActiveProjectId();
    res.json(await neonStorage.getCollection(db, pid, "segments"));
  });

  app.get("/api/ledger/element/:id", async (req, res) => {
    const pid = await getActiveProjectId();
    const elementId = req.params.id;
    const result = await neonStorage.getElementById(db, pid, elementId);
    if (result) return res.json(result);
    return res.status(404).json({ error: "Element not found" });
  });

  app.get("/api/ledger/elements/batch", async (req, res) => {
    const pid = await getActiveProjectId();
    const idsParam = req.query.ids as string;
    if (!idsParam) return res.json({ elements: {} });
    const ids = idsParam.split(",").map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return res.json({ elements: {} });
    const result = await neonStorage.getElementsByIds(db, pid, ids);
    res.json({ elements: result });
  });

  app.get("/api/ledger/relationships", async (_req, res) => {
    const pid = await getActiveProjectId();
    const result = await neonStorage.getRelationships(db, pid);
    res.json(result);
  });

  app.get("/api/ledger/registers", async (_req, res) => {
    const pid = await getActiveProjectId();
    const result = await neonStorage.getRegisters(db, pid);
    res.json(result);
  });

  app.get("/api/ledger/zachman-grid", async (_req, res) => {
    const pid = await getActiveProjectId();
    const result = await neonStorage.getZachmanGrid(db, pid);
    res.json(result);
  });

  app.get("/api/ledger/:projectId/zachman-grid", async (req, res) => {
    const result = await neonStorage.getZachmanGrid(db, req.params.projectId);
    res.json(result);
  });

  app.get("/api/ledger/baselines", async (_req, res) => {
    const pid = await getActiveProjectId();
    const result = await neonStorage.getCollection(db, pid, "baselines");
    res.json(result);
  });

  app.get("/api/actions-template", (_req, res) => {
    const templatePath = path.resolve("public", "ledger-upload.yml");
    if (fs.existsSync(templatePath)) {
      res.setHeader("Content-Type", "text/yaml");
      res.setHeader("Content-Disposition", 'attachment; filename="ledger-upload.yml"');
      fs.createReadStream(templatePath).pipe(res);
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  });

  app.get("/api/neon/status", async (_req, res) => {
    try {
      const pid = await getActiveProjectId();
      const hasAny = await neonStorage.hasAnyData(db);
      const hasProjectData = pid ? await neonStorage.hasData(db, pid) : false;
      res.json({ connected: true, hasProjectData, hasAnyData: hasAny, activeProjectId: pid });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      res.json({ connected: false, reason: message });
    }
  });

  app.post("/api/neon/migrate", async (_req, res) => {
    try {
      const allProjects = await storage.getProjects();
      const results: Record<string, { success: boolean; counts?: Record<string, number>; error?: string; skipped?: boolean; reason?: string }> = {};

      for (const proj of allProjects) {
        const project = await storage.getProject(proj.id);
        if (!project?.ledger) {
          results[proj.id] = { success: false, skipped: true, reason: "No ledger" };
          continue;
        }
        const importResult = await importLedgerToNeon(db, proj.id, project.ledger);
        results[proj.id] = importResult;
      }

      res.json({ success: true, results });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    res.json(await storage.getProjects());
  });

  app.get("/api/projects/active", async (_req, res) => {
    res.json({ projectId: await storage.getActiveProjectId() });
  });

  app.put("/api/projects/active", async (req, res) => {
    const { projectId } = req.body;
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ message: "projectId is required" });
    }
    const success = await storage.setActiveProjectId(projectId);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ projectId });
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
    }
    const project = await storage.createProject(parsed.data.name, parsed.data.description);
    res.status(201).json(project);
  });

  app.post("/api/projects/ensure", async (req, res) => {
    const { name, description } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "name is required" });
    }
    const { project, created } = await storage.ensureProject(name.trim(), description);
    const { ledger: _ledger, ...projectMeta } = project;
    res.status(created ? 201 : 200).json({ ...projectMeta, created });
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const { ledger: _ledger, ...projectMeta } = project;
    res.json(projectMeta);
  });

  app.get("/api/projects/:id/ledger", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const ledger = await storage.getLedgerForProject(req.params.id);
    if (!ledger) {
      return res.status(404).json({ message: "No ledger found for this project" });
    }
    res.json(ledger);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const projectsList = await storage.getProjects();
    if (projectsList.length <= 1) {
      return res.status(400).json({ message: "Cannot delete the last project" });
    }
    const success = await storage.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ success: true });
  });

  app.post("/api/projects/:id/ledger", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const mode = (req.query.mode as string || "replace").toLowerCase();
    const stepLabel = (req.query.stepLabel as string) || "Unnamed Step";

    if (mode !== "replace" && mode !== "append") {
      return res.status(400).json({ message: "Invalid mode. Use 'replace' or 'append'." });
    }

    const contentType = (req.headers["content-type"] || "").toLowerCase();
    const isJson = contentType.includes("application/json") ||
      (typeof req.body === "object" && req.body !== null && !Array.isArray(req.body) && req.body.elements);

    let parsedLedger: { ledger: import("@shared/schema").CanonicalLedger; warnings: any[]; elementCount: number };

    if (isJson) {
      try {
        let jsonData: Record<string, unknown>;
        if (typeof req.body === "string") {
          jsonData = JSON.parse(req.body);
        } else {
          jsonData = req.body;
        }
        parsedLedger = parseJsonLedger(jsonData as Record<string, unknown>);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(400).json({ message: `Failed to parse JSON ledger: ${msg}` });
      }
    } else {
      let markdownContent: string;
      if (typeof req.body === "string") {
        markdownContent = req.body;
      } else if (req.body?.content && typeof req.body.content === "string") {
        markdownContent = req.body.content;
      } else {
        return res.status(400).json({ message: "Expected markdown content as text, JSON { content: string }, or a JSON ledger file" });
      }

      if (markdownContent.length < 10) {
        return res.status(400).json({ message: "Ledger content is too short" });
      }

      try {
        parsedLedger = parseLedgerMarkdown(markdownContent);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(400).json({ message: `Failed to parse ledger: ${msg}` });
      }
    }

    const projectId = req.params.id;

    if (mode === "append") {
      try {
        const appendResult = await appendLedgerToNeon(db, projectId, parsedLedger.ledger, stepLabel);
        if (!appendResult.success) {
          return res.status(500).json({ message: `Append failed: ${appendResult.error}` });
        }

        const existingLedger = await storage.getLedgerForProject(projectId);
        const mergedLedger = mergeLedgerJsonb(existingLedger, parsedLedger.ledger);

        const baselineEntry = {
          baseline_id: appendResult.baselineId,
          name: stepLabel,
          description: appendResult.baselineDescription,
          baseline_type: "LedgerStep",
          created_utc: appendResult.baselineCreatedUtc,
          confidence: 1.0,
        };
        if (!mergedLedger.baselines) (mergedLedger as any).baselines = [];
        (mergedLedger as any).baselines.push(baselineEntry);

        await storage.setProjectLedger(projectId, mergedLedger);

        res.json({
          success: true,
          mode: "append",
          newElements: appendResult.newElements,
          baselineId: appendResult.baselineId,
          counts: appendResult.counts,
          warnings: parsedLedger.warnings,
          ledgerId: parsedLedger.ledger.ledger_id,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ message: `Append error: ${msg}` });
      }
      return;
    }

    await storage.setProjectLedger(projectId, parsedLedger.ledger);

    let neonImported = false;
    try {
      const neonResult = await importLedgerToNeon(db, projectId, parsedLedger.ledger);
      neonImported = neonResult.success;
      if (!neonResult.success) {
        console.error("[Neon] Import failed during upload:", neonResult.error);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[Neon] Import error during upload:", msg);
    }

    res.json({
      success: true,
      mode: "replace",
      elementCount: parsedLedger.elementCount,
      warnings: parsedLedger.warnings,
      ledgerId: parsedLedger.ledger.ledger_id,
      neonImported,
    });
  });

  return httpServer;
}
