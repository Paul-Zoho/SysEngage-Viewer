import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { parseLedgerMarkdown, parseJsonLedger } from "./ledgerParser";
import { getNeonDb } from "./neonDb";
import { importLedgerToNeon } from "./neonImport";
import * as neonStorage from "./neonStorage";

async function getActiveProjectId(): Promise<string> {
  return storage.getActiveProjectId();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const db = getNeonDb();

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

    const contentType = (req.headers["content-type"] || "").toLowerCase();
    const isJson = contentType.includes("application/json") ||
      (typeof req.body === "object" && req.body !== null && !Array.isArray(req.body) && req.body.elements);

    if (isJson) {
      try {
        let jsonData: Record<string, unknown>;
        if (typeof req.body === "string") {
          jsonData = JSON.parse(req.body);
        } else {
          jsonData = req.body;
        }
        const result = parseJsonLedger(jsonData as Record<string, unknown>);
        await storage.setProjectLedger(req.params.id, result.ledger);

        let neonImported = false;
        try {
          const neonResult = await importLedgerToNeon(db, req.params.id, result.ledger);
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
          elementCount: result.elementCount,
          warnings: result.warnings,
          ledgerId: result.ledger.ledger_id,
          neonImported,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ message: `Failed to parse JSON ledger: ${msg}` });
      }
      return;
    }

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
      const result = parseLedgerMarkdown(markdownContent);
      await storage.setProjectLedger(req.params.id, result.ledger);

      let neonImported = false;
      try {
        const neonResult = await importLedgerToNeon(db, req.params.id, result.ledger);
        neonImported = neonResult.success;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[Neon] Import error during markdown upload:", msg);
      }

      res.json({
        success: true,
        elementCount: result.elementCount,
        warnings: result.warnings,
        ledgerId: result.ledger.ledger_id,
        neonImported,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({ message: `Failed to parse ledger: ${msg}` });
    }
  });

  return httpServer;
}
