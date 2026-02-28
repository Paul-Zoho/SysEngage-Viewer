import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { parseLedgerMarkdown } from "./ledgerParser";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/ledger", (_req, res) => {
    res.json(storage.getLedger());
  });

  app.get("/api/ledger/stats", (_req, res) => {
    res.json(storage.getLedgerStats());
  });

  app.get("/api/ledger/sources", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.sources ?? []);
  });

  app.get("/api/ledger/requirements", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.requirements ?? []);
  });

  app.get("/api/ledger/findings", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.findings ?? []);
  });

  app.get("/api/ledger/gaps", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.gaps ?? []);
  });

  app.get("/api/ledger/risks", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.risks ?? []);
  });

  app.get("/api/ledger/issues", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.issues ?? []);
  });

  app.get("/api/ledger/traces", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.traces ?? []);
  });

  app.get("/api/ledger/decisions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.decisions ?? []);
  });

  app.get("/api/ledger/domains", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.domains ?? []);
  });

  app.get("/api/ledger/coverage", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.coverage_items ?? []);
  });

  app.get("/api/ledger/rules", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.rules ?? []);
  });

  app.get("/api/ledger/questions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.questions ?? []);
  });

  app.get("/api/ledger/assumptions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.assumptions ?? []);
  });

  app.get("/api/ledger/constraints", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.constraints ?? []);
  });

  app.get("/api/ledger/stakeholders", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger?.stakeholders ?? []);
  });

  app.get("/api/ledger/registers", (_req, res) => {
    const ledger = storage.getLedger();
    if (!ledger) return res.json([]);
    res.json([
      ledger.source_register,
      ledger.findings_register,
      ledger.gap_register,
      ledger.zachman_cell_register,
      ledger.trace_register,
      ledger.domain_register,
      ledger.requirement_register,
      ledger.active_risk_register,
      ledger.issue_register,
      ledger.question_register,
      ledger.answer_register,
      ledger.assumption_register,
      ledger.constraint_register,
      ledger.candidate_requirement_register,
      ledger.suggestion_register,
      ledger.decision_register,
      ledger.coverage_register,
      ledger.evaluation_register,
      ledger.violation_register,
      ledger.stakeholder_register,
      ledger.narrative_summary_register,
    ]);
  });

  app.get("/api/projects", (_req, res) => {
    res.json(storage.getProjects());
  });

  app.get("/api/projects/active", (_req, res) => {
    res.json({ projectId: storage.getActiveProjectId() });
  });

  app.put("/api/projects/active", (req, res) => {
    const { projectId } = req.body;
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ message: "projectId is required" });
    }
    const success = storage.setActiveProjectId(projectId);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ projectId });
  });

  app.post("/api/projects", (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
    }
    const project = storage.createProject(parsed.data.name, parsed.data.description);
    res.status(201).json(project);
  });

  app.delete("/api/projects/:id", (req, res) => {
    const projects = storage.getProjects();
    if (projects.length <= 1) {
      return res.status(400).json({ message: "Cannot delete the last project" });
    }
    const success = storage.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ success: true });
  });

  app.post("/api/projects/:id/ledger", (req, res) => {
    const project = storage.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let markdownContent: string;
    if (typeof req.body === "string") {
      markdownContent = req.body;
    } else if (req.body?.content && typeof req.body.content === "string") {
      markdownContent = req.body.content;
    } else {
      return res.status(400).json({ message: "Expected markdown content as text or JSON { content: string }" });
    }

    if (markdownContent.length < 10) {
      return res.status(400).json({ message: "Ledger content is too short" });
    }

    try {
      const result = parseLedgerMarkdown(markdownContent);
      storage.setProjectLedger(req.params.id, result.ledger);
      res.json({
        success: true,
        elementCount: result.elementCount,
        warnings: result.warnings,
        ledgerId: result.ledger.ledger_id,
      });
    } catch (err: any) {
      res.status(400).json({ message: `Failed to parse ledger: ${err.message}` });
    }
  });

  return httpServer;
}
