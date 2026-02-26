import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
    res.json(ledger.sources);
  });

  app.get("/api/ledger/requirements", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.requirements);
  });

  app.get("/api/ledger/findings", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.findings);
  });

  app.get("/api/ledger/gaps", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.gaps);
  });

  app.get("/api/ledger/risks", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.risks);
  });

  app.get("/api/ledger/issues", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.issues);
  });

  app.get("/api/ledger/traces", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.traces);
  });

  app.get("/api/ledger/decisions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.decisions);
  });

  app.get("/api/ledger/domains", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.domains);
  });

  app.get("/api/ledger/coverage", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.coverage_items);
  });

  app.get("/api/ledger/rules", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.rules);
  });

  app.get("/api/ledger/questions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.questions);
  });

  app.get("/api/ledger/assumptions", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.assumptions);
  });

  app.get("/api/ledger/constraints", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.constraints);
  });

  app.get("/api/ledger/stakeholders", (_req, res) => {
    const ledger = storage.getLedger();
    res.json(ledger.stakeholders);
  });

  app.get("/api/ledger/registers", (_req, res) => {
    const ledger = storage.getLedger();
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

  return httpServer;
}
