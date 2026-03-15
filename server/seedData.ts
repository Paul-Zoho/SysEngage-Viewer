import type { CanonicalLedger, Register } from "@shared/schema";

export function createSeedLedger(): CanonicalLedger {
  const sources = [
    { source_id: "S001", source_text: "The system SHALL provide real-time telemetry data acquisition from all sensor nodes at a minimum rate of 10 Hz.", segmentation_context: "Performance requirement from SRD Section 3.2", confidence: 0.95 },
    { source_id: "S002", source_text: "All communication interfaces SHALL comply with MIL-STD-1553B for data bus operations.", segmentation_context: "Interface compliance requirement from ICD v2.1", confidence: 0.92 },
    { source_id: "S003", source_text: "The thermal management subsystem SHALL maintain operating temperature within -40C to +85C range across all mission phases.", segmentation_context: "Environmental constraint from ENVS-001", confidence: 0.98 },
    { source_id: "S004", source_text: "System availability SHALL be no less than 99.95% measured over any continuous 30-day period.", segmentation_context: "Availability requirement from SLA Appendix B", confidence: 0.90 },
    { source_id: "S005", source_text: "The power distribution unit SHALL support hot-swappable module replacement without system interruption.", segmentation_context: "Maintainability requirement from MRD Section 5.1", confidence: 0.88 },
    { source_id: "S006", source_text: "All safety-critical software SHALL be developed in accordance with DO-178C DAL-A guidelines.", segmentation_context: "Safety standard compliance from Safety Plan v3.0", confidence: 0.97 },
    { source_id: "S007", source_text: "The navigation subsystem SHALL achieve position accuracy of 5 meters CEP under GPS-denied conditions.", segmentation_context: "Navigation performance from Nav-CONOPS", confidence: 0.85 },
    { source_id: "S008", source_text: "Data encryption SHALL use AES-256 for all classified information at rest and in transit.", segmentation_context: "Security requirement from STIG Checklist", confidence: 0.96 },
  ];

  const domains = [
    { domain_id: "D001", name: "Avionics", description: "Flight control and avionics systems domain covering navigation, communication, and sensor integration." },
    { domain_id: "D002", name: "Power Systems", description: "Electrical power generation, distribution, and management systems." },
    { domain_id: "D003", name: "Thermal Management", description: "Heat dissipation, cooling systems, and thermal protection." },
    { domain_id: "D004", name: "Software Engineering", description: "Embedded software development, testing, and certification processes." },
    { domain_id: "D005", name: "Communications", description: "Data link, radio frequency, and network communication systems." },
  ];

  const requirements = [
    { requirement_id: "R001", statement: "The system shall acquire telemetry data from all sensor nodes at a minimum rate of 10 Hz with data integrity verification.", requirement_type: "Performance", source_refs: ["S001"], domain_refs: ["D001"], fit_criteria: "Measured data rate >= 10 Hz with < 0.01% packet loss", verification_method: "Test", priority: "High", confidence: 0.93 },
    { requirement_id: "R002", statement: "All MIL-STD-1553B data bus interfaces shall be validated against protocol compliance test suite.", requirement_type: "Constraint", source_refs: ["S002"], domain_refs: ["D005"], fit_criteria: "Pass rate >= 100% on compliance test suite", verification_method: "Test", priority: "High", confidence: 0.91 },
    { requirement_id: "R003", statement: "Operating temperature range shall be maintained between -40C and +85C during all mission phases.", requirement_type: "Performance", source_refs: ["S003"], domain_refs: ["D003"], fit_criteria: "Temperature within bounds for 100% of mission duration", verification_method: "Analysis", priority: "High", confidence: 0.96 },
    { requirement_id: "R004", statement: "System availability shall meet or exceed 99.95% over any continuous 30-day measurement window.", requirement_type: "Performance", source_refs: ["S004"], domain_refs: ["D001", "D002"], fit_criteria: "Availability >= 99.95% per 30-day window", verification_method: "Demonstration", priority: "High", confidence: 0.89 },
    { requirement_id: "R005", statement: "PDU modules shall support hot-swap replacement with zero system downtime.", requirement_type: "Functional", source_refs: ["S005"], domain_refs: ["D002"], fit_criteria: "Module replacement completed without service interruption", verification_method: "Demonstration", priority: "Medium", confidence: 0.87 },
    { requirement_id: "R006", statement: "Safety-critical software components shall achieve DO-178C DAL-A certification.", requirement_type: "Constraint", rationale: "Required by airworthiness certification authority", source_refs: ["S006"], domain_refs: ["D004"], verification_method: "Inspection", priority: "High", confidence: 0.95 },
    { requirement_id: "R007", statement: "Navigation position accuracy shall be 5 meters CEP or better under GPS-denied conditions.", requirement_type: "Performance", source_refs: ["S007"], domain_refs: ["D001"], fit_criteria: "CEP <= 5m in GPS-denied test scenarios", verification_method: "Test", priority: "High", confidence: 0.83 },
  ];

  const findings = [
    { finding_id: "F001", type: "Compliance Gap", description: "MIL-STD-1553B compliance test suite coverage is incomplete for error injection scenarios.", severity: "High" as const, related_items: ["R002", "S002"], produced_by_pass_id: "P001", rule_triggered: ["RL001"], confidence: 0.88, source_refs: ["S002"] },
    { finding_id: "F002", type: "Design Concern", description: "Thermal analysis shows potential hot spots near PDU module bay under extended high-load operation.", severity: "Medium" as const, related_items: ["R003", "R005"], produced_by_pass_id: "P001", confidence: 0.82, source_refs: ["S003", "S005"] },
    { finding_id: "F003", type: "Verification Gap", description: "No test procedure defined for GPS-denied navigation accuracy validation.", severity: "High" as const, related_items: ["R007"], produced_by_pass_id: "P002", rule_triggered: ["RL002"], confidence: 0.90, source_refs: ["S007"] },
    { finding_id: "F004", type: "Process Non-Conformance", description: "DO-178C structural coverage analysis tooling not yet qualified for DAL-A.", severity: "High" as const, related_items: ["R006"], produced_by_pass_id: "P002", confidence: 0.85, source_refs: ["S006"] },
    { finding_id: "F005", type: "Requirement Ambiguity", description: "System availability measurement methodology not specified - unclear if planned maintenance windows are excluded.", severity: "Medium" as const, related_items: ["R004", "S004"], produced_by_pass_id: "P001", confidence: 0.78, source_refs: ["S004"] },
  ];

  const gaps = [
    { gap_id: "G001", description: "Missing error injection test cases for MIL-STD-1553B protocol compliance validation.", impact: "High - May delay interface qualification milestone", affected_cells: ["ZC-R2-C-How"], proposed_resolution: "Develop comprehensive error injection test suite covering all specified fault conditions.", resolution_state: "Open", domain_refs: ["D005"], traceability: ["T001"], produced_from_finding_ids: ["F001"] },
    { gap_id: "G002", description: "Thermal model incomplete for PDU high-load scenarios - missing convection coefficients.", impact: "Medium - Could result in thermal derating requirements", affected_cells: ["ZC-R2-C-Where"], proposed_resolution: "Commission CFD analysis for PDU bay thermal environment characterization.", resolution_state: "Open", domain_refs: ["D003"], traceability: ["T002"], produced_from_finding_ids: ["F002"] },
    { gap_id: "G003", description: "GPS-denied navigation test environment not established.", impact: "High - Blocks navigation subsystem verification", affected_cells: ["ZC-R2-C-What"], proposed_resolution: "Establish HITL simulation environment with GPS signal denial capability.", resolution_state: "Accepted", domain_refs: ["D001"], traceability: ["T003"], produced_from_finding_ids: ["F003"] },
    { gap_id: "G004", description: "DO-178C tool qualification evidence package incomplete.", impact: "High - Certification risk for safety-critical software", affected_cells: ["ZC-R3-C-Who"], proposed_resolution: "Initiate tool qualification project per DO-330 guidelines.", resolution_state: "Open", domain_refs: ["D004"], traceability: ["T004"], produced_from_finding_ids: ["F004"] },
  ];

  const traces = [
    { trace_id: "T001", from_id: "S002", to_id: "R002", trace_type: "ST" as const, rationale: "Source requirement traces to derived interface compliance requirement.", confidence: 0.95 },
    { trace_id: "T002", from_id: "S003", to_id: "R003", trace_type: "ST" as const, rationale: "Environmental constraint source traces to thermal requirement.", confidence: 0.97 },
    { trace_id: "T003", from_id: "R007", to_id: "F003", trace_type: "DT" as const, rationale: "Navigation requirement derives finding about test gap.", confidence: 0.88, interpretation_magnitude: 0.3 },
    { trace_id: "T004", from_id: "R006", to_id: "F004", trace_type: "DT" as const, rationale: "Certification requirement derives finding about tool qualification.", confidence: 0.90, interpretation_magnitude: 0.2 },
    { trace_id: "T005", from_id: "S001", to_id: "R001", trace_type: "ST" as const, rationale: "Telemetry source traces to performance requirement.", confidence: 0.94 },
    { trace_id: "T006", from_id: "R001", to_id: "R004", trace_type: "GT" as const, rationale: "Telemetry rate impacts overall system availability.", confidence: 0.75 },
    { trace_id: "T007", from_id: "S005", to_id: "R005", trace_type: "ST" as const, rationale: "Maintainability source traces to hot-swap requirement.", confidence: 0.91 },
    { trace_id: "T008", from_id: "F001", to_id: "G001", trace_type: "AT" as const, rationale: "Compliance finding produces gap for missing test cases.", confidence: 0.92 },
    { trace_id: "T009", from_id: "F002", to_id: "G002", trace_type: "AT" as const, rationale: "Thermal finding produces gap for incomplete model.", confidence: 0.85 },
    { trace_id: "T010", from_id: "S008", to_id: "R002", trace_type: "GT" as const, rationale: "Security encryption requirement relates to communication interface compliance.", confidence: 0.70 },
  ];

  const risks = [
    { risk_id: "K001", title: "MIL-STD-1553B Qualification Delay", description: "Incomplete error injection test suite may delay interface qualification by 6-8 weeks.", category: "Schedule", likelihood: "High" as const, impact: "High" as const, exposure: "High", mitigation: "Parallel development of test cases with early vendor engagement.", owner: "Test Lead", status: "Active", related_element_ids: ["G001", "F001"], confidence: 0.87 },
    { risk_id: "K002", title: "Thermal Derating Impact", description: "Potential thermal issues in PDU bay may require component derating, reducing system performance.", category: "Technical", likelihood: "Medium" as const, impact: "Medium" as const, exposure: "Medium", mitigation: "Expedite CFD analysis and consider enhanced cooling solutions.", owner: "Thermal Engineer", status: "Active", related_element_ids: ["G002", "F002"], confidence: 0.80 },
    { risk_id: "K003", title: "DO-178C Certification Timeline", description: "Tool qualification delays could push certification beyond program milestone.", category: "Compliance", likelihood: "Medium" as const, impact: "High" as const, exposure: "High", mitigation: "Evaluate pre-qualified alternative tools as backup option.", owner: "Software QA Lead", status: "Active", related_element_ids: ["G004", "F004"], confidence: 0.84 },
    { risk_id: "K004", title: "GPS-Denied Nav Accuracy", description: "Navigation accuracy may not meet 5m CEP requirement without adequate testing environment.", category: "Performance", likelihood: "Medium" as const, impact: "High" as const, exposure: "Medium", mitigation: "Establish HITL test capability and augment with inertial navigation improvements.", owner: "Navigation Lead", status: "Mitigated", related_element_ids: ["G003", "R007"], confidence: 0.79 },
  ];

  const issues = [
    { issue_id: "I001", title: "Sensor data timestamp synchronization drift", description: "Observed 2ms timestamp drift between sensor nodes after 72 hours of continuous operation, exceeding 1ms tolerance.", severity: "High" as const, status: "Open", related_element_ids: ["R001"], owner: "Integration Lead", confidence: 0.91 },
    { issue_id: "I002", title: "PDU Module B connector pin damage", description: "Pin 14 on Module B connector shows signs of wear after 50 insertion cycles, specification requires 500 cycles.", severity: "Medium" as const, status: "InProgress", resolution_summary: "Vendor investigating connector material upgrade.", related_element_ids: ["R005"], owner: "Hardware Lead", confidence: 0.88 },
    { issue_id: "I003", title: "MCDC coverage tool false positives", description: "Structural coverage analysis tool reporting false positive MCDC coverage for nested conditional blocks.", severity: "High" as const, status: "Open", related_element_ids: ["R006", "F004"], owner: "Software QA Lead", confidence: 0.86 },
  ];

  const decisions = [
    { decision_id: "DCS001", title: "Adopt HITL Simulation for Nav Testing", description: "Decided to establish Hardware-in-the-Loop simulation capability for GPS-denied navigation testing rather than field testing.", decision_type: "Architectural", status: "Accepted", related_element_ids: ["G003", "R007"], rationale: "HITL provides repeatable, controlled test environment at lower cost than field campaigns.", confidence: 0.92 },
    { decision_id: "DCS002", title: "Parallel Tool Qualification Path", description: "Pursue qualification of primary tool while evaluating pre-qualified backup tool as contingency.", decision_type: "Risk", status: "Accepted", related_element_ids: ["G004", "K003"], rationale: "Dual-path approach mitigates schedule risk for certification timeline.", confidence: 0.88 },
    { decision_id: "DCS003", title: "Enhanced Thermal Monitoring", description: "Add embedded thermal sensors in PDU bay for real-time temperature monitoring during integration testing.", decision_type: "Architectural", status: "Proposed", related_element_ids: ["G002", "K002"], rationale: "Direct measurement data will validate thermal model and identify hot spots early.", confidence: 0.85 },
  ];

  const questions = [
    { question_id: "Q001", question_text: "Are planned maintenance windows excluded from the 99.95% availability calculation?", why_it_matters: "Ambiguity in SLA Appendix B availability definition", priority: "High", status: "Open", related_gap_ids: [], source_refs: ["S004"], confidence: 0.78 },
    { question_id: "Q002", question_text: "What is the maximum acceptable recovery time after a hot-swap module replacement?", why_it_matters: "Not specified in MRD Section 5.1", priority: "Medium", status: "Answered", source_refs: ["S005"], confidence: 0.82 },
  ];

  const answers = [
    { answer_id: "A001", question_id: "Q002", response_text: "Maximum recovery time after hot-swap shall not exceed 500ms for non-safety-critical modules and 100ms for safety-critical modules.", provided_by: "Chief Systems Engineer", confidence: 0.90 },
  ];

  const assumptions = [
    { assumption_id: "AS001", statement: "GPS signal will be available for initial position fix before entering GPS-denied environment.", scope: "Navigation subsystem", related_element_ids: ["R007"], source_refs: ["S007"], confidence: 0.85 },
    { assumption_id: "AS002", statement: "Ambient temperature in equipment bay will not exceed 55C during ground operations.", scope: "Thermal management", related_element_ids: ["R003"], source_refs: ["S003"], confidence: 0.80 },
  ];

  const constraints = [
    { constraint_id: "C001", statement: "All safety-critical software development must comply with DO-178C DAL-A.", constraint_type: "Regulatory", source_refs: ["S006"], domain_refs: ["D004"], priority: "High", confidence: 0.98 },
    { constraint_id: "C002", statement: "Data bus interfaces limited to MIL-STD-1553B protocol only.", constraint_type: "Technical", rationale: "Platform legacy interface standardization requirement.", source_refs: ["S002"], domain_refs: ["D005"], priority: "High", confidence: 0.95 },
  ];

  const zachmanCells = [
    { cell_id: "ZC-R2-C-What", row: "2", column: "What", obligation_rules_ref: ["RL001"] },
    { cell_id: "ZC-R2-C-How", row: "2", column: "How", obligation_rules_ref: ["RL001", "RL002"] },
    { cell_id: "ZC-R2-C-Where", row: "2", column: "Where", obligation_rules_ref: ["RL002"] },
    { cell_id: "ZC-R3-C-Who", row: "3", column: "Who", obligation_rules_ref: ["RL001"] },
    { cell_id: "ZC-R1-C-What", row: "1", column: "What", obligation_rules_ref: ["RL001"] },
    { cell_id: "ZC-R1-C-How", row: "1", column: "How", obligation_rules_ref: ["RL002"] },
  ];

  const rules = [
    { rule_id: "RL001", name: "Requirement Completeness Check", description: "Every requirement shall have traceable source reference, verification method, and acceptance criteria.", rule_type: "Quality", severity_default: "High", applies_to_element_types: ["Requirement", "CandidateRequirement"], confidence: 0.95 },
    { rule_id: "RL002", name: "Test Coverage Validation", description: "Every testable requirement shall have at least one associated test procedure or verification activity.", rule_type: "Coverage", severity_default: "High", applies_to_element_types: ["Requirement"], confidence: 0.93 },
    { rule_id: "RL003", name: "Trace Completeness Rule", description: "Every requirement shall trace to at least one source document excerpt.", rule_type: "Consistency", applies_to_element_types: ["Requirement", "Trace"], confidence: 0.97 },
  ];

  const evaluations = [
    { evaluation_id: "EV001", evaluation_type: "Requirements Quality Assessment", scope_description: "Evaluation of all baselined requirements for completeness, testability, and traceability.", rule_ids: ["RL001", "RL002", "RL003"], produced_finding_ids: ["F001", "F005"], produced_gap_ids: ["G001"], confidence: 0.88 },
  ];

  const analysisPasses = [
    { pass_id: "P001", pass_type: "Requirements Analysis", evaluated_scope: "Full requirements baseline review against source documents and compliance standards.", evaluation_ids: ["EV001"], rule_ids: ["RL001", "RL002"], produced_finding_ids: ["F001", "F002", "F005"], produced_gap_ids: ["G001", "G002"], confidence: 0.90 },
    { pass_id: "P002", pass_type: "Verification Readiness Review", evaluated_scope: "Assessment of test readiness for performance and compliance requirements.", rule_ids: ["RL002"], produced_finding_ids: ["F003", "F004"], produced_gap_ids: ["G003", "G004"], confidence: 0.87 },
  ];

  const coverageItems = [
    { coverage_id: "CV001", coverage_type: "Requirement", target_id: "R001", coverage_state: "Covered", produced_by_pass_id: "P001", notes: "Telemetry data rate requirement fully covered by test procedure TP-001.", confidence: 0.92 },
    { coverage_id: "CV002", coverage_type: "Requirement", target_id: "R002", coverage_state: "PartiallyCovered", produced_by_pass_id: "P001", notes: "Nominal protocol compliance covered; error injection scenarios pending.", confidence: 0.85 },
    { coverage_id: "CV003", coverage_type: "Requirement", target_id: "R003", coverage_state: "Covered", produced_by_pass_id: "P001", confidence: 0.94 },
    { coverage_id: "CV004", coverage_type: "Requirement", target_id: "R007", coverage_state: "NotCovered", produced_by_pass_id: "P002", notes: "No test environment established for GPS-denied testing.", confidence: 0.90 },
    { coverage_id: "CV005", coverage_type: "Cell", target_id: "ZC-R2-C-What", coverage_state: "PartiallyCovered", produced_by_pass_id: "P002", confidence: 0.78 },
    { coverage_id: "CV006", coverage_type: "Domain", target_id: "D004", coverage_state: "PartiallyCovered", produced_by_pass_id: "P002", notes: "Tool qualification incomplete for software domain.", confidence: 0.80 },
  ];

  const suggestions = [
    { suggestion_id: "SG001", description: "Consider adopting an automated regression test framework for MIL-STD-1553B compliance to accelerate error injection testing.", suggestion_type: "Process Improvement", target_element_ids: ["G001", "R002"], rationale: "Automated testing would reduce qualification timeline by estimated 3 weeks.", confidence: 0.82 },
    { suggestion_id: "SG002", description: "Implement continuous thermal monitoring during integration testing to build empirical thermal model.", suggestion_type: "Design Enhancement", target_element_ids: ["G002", "R003"], rationale: "Real-time data would supplement analytical thermal model with measured performance.", confidence: 0.79 },
  ];

  const candidateRequirements = [
    { candidate_requirement_id: "CR001", statement: "The system shall provide automated health monitoring with predictive failure alerting for all critical subsystems.", requirement_type: "Functional", source_refs: ["S004"], domain_refs: ["D001", "D002"], status: "Proposed", confidence: 0.75 },
    { candidate_requirement_id: "CR002", statement: "Navigation subsystem shall support multi-constellation GNSS reception as fallback for GPS-denied scenarios.", requirement_type: "Performance", source_refs: ["S007"], domain_refs: ["D001"], status: "Accepted", confidence: 0.80 },
  ];

  const violations = [
    { violation_id: "V001", rule_id: "RL002", description: "Requirement R007 has no associated test procedure defined.", severity: "High" as const, related_element_ids: ["R007"], produced_by_pass_id: "P002", confidence: 0.92 },
  ];

  const stakeholders = [
    { stakeholder_id: "SH001", name: "Program Manager", role: "Program Management", description: "Responsible for overall program execution, schedule, and budget.", domain_refs: ["D001", "D002", "D003", "D004", "D005"], confidence: 0.95 },
    { stakeholder_id: "SH002", name: "Chief Systems Engineer", role: "Systems Engineering", description: "Technical authority for system architecture and requirements baseline.", domain_refs: ["D001", "D005"], confidence: 0.95 },
    { stakeholder_id: "SH003", name: "Safety Certification Authority", role: "Safety & Compliance", description: "External authority responsible for airworthiness certification approval.", domain_refs: ["D004"], confidence: 0.98 },
  ];

  const narrativeSummaries = [
    { summary_id: "NS001", viewpoint: "Executive Summary", scope_description: "High-level status overview of system engineering analysis activities.", summary_text: "Analysis of the system requirements baseline has identified 5 findings across compliance, design, verification, and process domains. Four gaps require resolution, with three classified as high impact. The risk register contains 4 active risks, with MIL-STD-1553B qualification delay and DO-178C certification timeline representing the most critical schedule threats. Two architectural decisions have been accepted to address navigation testing and tool qualification paths.", produced_by_pass_id: "P001", confidence: 0.85 },
  ];

  const segments = [
    { segment_id: "SEG001", source_id: "S001", segment_text: "real-time telemetry data acquisition from all sensor nodes", segment_index: 0, classification: "Performance", confidence: 0.93 },
    { segment_id: "SEG002", source_id: "S001", segment_text: "at a minimum rate of 10 Hz", segment_index: 1, classification: "Quantitative", confidence: 0.95 },
    { segment_id: "SEG003", source_id: "S002", segment_text: "comply with MIL-STD-1553B for data bus operations", segment_index: 0, classification: "Compliance", confidence: 0.92 },
    { segment_id: "SEG004", source_id: "S006", segment_text: "developed in accordance with DO-178C DAL-A guidelines", segment_index: 0, classification: "Safety", confidence: 0.97 },
  ];

  const sourceAtoms = [
    { atom_id: "SA001", segment_id: "SEG001", atom_text: "telemetry data acquisition", atom_type: "Function", confidence: 0.91 },
    { atom_id: "SA002", segment_id: "SEG001", atom_text: "all sensor nodes", atom_type: "Scope", confidence: 0.90 },
    { atom_id: "SA003", segment_id: "SEG002", atom_text: "10 Hz", atom_type: "Threshold", confidence: 0.95 },
    { atom_id: "SA004", segment_id: "SEG003", atom_text: "MIL-STD-1553B", atom_type: "Standard", confidence: 0.92 },
    { atom_id: "SA005", segment_id: "SEG004", atom_text: "DO-178C DAL-A", atom_type: "Standard", confidence: 0.97 },
  ];

  const cellContentItems = [
    { content_item_id: "CCI001", cell_id: "ZC-R2-C-What", element_id: "R001", element_type: "Requirement", relevance_score: 0.95, confidence: 0.90 },
    { content_item_id: "CCI002", cell_id: "ZC-R2-C-What", element_id: "R007", element_type: "Requirement", relevance_score: 0.88, confidence: 0.85 },
    { content_item_id: "CCI003", cell_id: "ZC-R2-C-How", element_id: "R002", element_type: "Requirement", relevance_score: 0.92, confidence: 0.91 },
  ];

  const cellRelationships = [
    { relationship_id: "CR001", from_ci: "ZC-R2-C-What", to_ci: "ZC-R2-C-How", relationship_type: "DataFlow", description: "Sensor data flows to processing functions.", confidence: 0.88 },
    { relationship_id: "CR002", from_ci: "ZC-R2-C-How", to_ci: "ZC-R2-C-Where", relationship_type: "Deployment", description: "Functions deployed across network nodes.", confidence: 0.82 },
  ];

  const checklists = [
    { checklist_id: "CL001", name: "Requirements Quality Checklist", description: "Checklist for evaluating requirement statement quality including completeness, testability, and unambiguity.", checklist_type: "Quality", applies_to_element_types: ["Requirement", "CandidateRequirement"], confidence: 0.93 },
    { checklist_id: "CL002", name: "DO-178C Compliance Checklist", description: "Checklist for verifying software development process compliance with DO-178C objectives.", checklist_type: "Compliance", applies_to_element_types: ["Requirement", "CoverageItem"], confidence: 0.96 },
  ];

  const structuralRepresentations = [
    { representation_id: "SR001", representation_type: "TraceabilityMatrix", scope_description: "Source-to-Requirement traceability matrix for baseline requirements.", content: "Matrix showing bidirectional trace links between 8 sources and 7 requirements with coverage indicators.", related_element_ids: ["T001", "T002", "T005", "T006", "T007"], confidence: 0.90 },
    { representation_id: "SR002", representation_type: "RiskHeatMap", scope_description: "Risk likelihood vs impact heat map for active risk register.", content: "2D matrix plotting 4 risks by likelihood (H/M/L) and impact (H/M/L) with color-coded exposure levels.", related_element_ids: ["K001", "K002", "K003", "K004"], confidence: 0.87 },
  ];

  const controlArtefacts = [
    { artefact_id: "CA001", artefact_type: "TestProcedure", name: "TP-001 Telemetry Rate Test", description: "Test procedure for validating 10 Hz telemetry data acquisition rate across all sensor nodes.", state: "Approved", related_element_ids: ["R001", "CV001"], confidence: 0.94 },
    { artefact_id: "CA002", artefact_type: "AnalysisReport", name: "Thermal Analysis Report v2.1", description: "CFD-based thermal analysis of PDU module bay under nominal and high-load operating conditions.", state: "Draft", related_element_ids: ["R003", "G002", "F002"], confidence: 0.82 },
    { artefact_id: "CA003", artefact_type: "CertificationPackage", name: "DO-178C TQL-1 Evidence Package", description: "Tool qualification evidence package for structural coverage analysis tool per DO-330.", state: "InProgress", related_element_ids: ["R006", "G004"], confidence: 0.78 },
  ];

  const signals = [
    { signal_id: "SIG001", signal_type: "Escalation", observed_text: "MIL-STD-1553B qualification delay risk requires program management attention.", description: "MIL-STD-1553B qualification delay risk requires program management attention.", produced_by_pass_id: "AP001", source_refs: ["K001"], confidence: 0.90 },
    { signal_id: "SIG002", signal_type: "ReviewRequired", observed_text: "Thermal analysis report requires Chief Systems Engineer review before baselining.", description: "Thermal analysis report requires Chief Systems Engineer review before baselining.", produced_by_pass_id: "AP002", source_refs: ["CA002"], confidence: 0.85 },
  ];

  const concerns = [
    { concern_id: "CON001", description: "Certification timeline may not accommodate tool qualification activities.", concern_category: "Schedule", raised_by_stakeholder_id: "SH003", related_element_ids: ["K003", "G004"], priority: "High", status: "Open", confidence: 0.88 },
    { concern_id: "CON002", description: "Thermal derating could impact system performance margins beyond acceptable levels.", concern_category: "Performance", raised_by_stakeholder_id: "SH002", related_element_ids: ["K002", "G002"], priority: "Medium", status: "Open", confidence: 0.82 },
  ];

  const closureMatrices = [
    { matrix_id: "CM001", matrix_type: "GapClosure", description: "Tracks closure state of all identified gaps against resolution activities.", row_element_ids: ["G001", "G002", "G003", "G004"], column_element_ids: ["DCS001", "DCS002", "DCS003"], closure_states: { "G001_DCS001": "Open", "G002_DCS003": "InProgress", "G003_DCS001": "Closed", "G004_DCS002": "InProgress" }, confidence: 0.86 },
  ];

  const baselines = [
    { baseline_id: "BL001", name: "Requirements Baseline v1.0", description: "Initial baselined set of system requirements approved for implementation.", baseline_type: "Requirements", element_ids: ["R001", "R002", "R003", "R004", "R005", "R006", "R007"], created_utc: "2026-01-15T00:00:00Z", confidence: 0.95 },
    { baseline_id: "BL002", name: "Risk Register Baseline v1.0", description: "Initial risk register baseline established at PDR.", baseline_type: "Risk", element_ids: ["K001", "K002", "K003", "K004"], created_utc: "2026-01-20T00:00:00Z", confidence: 0.92 },
  ];

  const changeRecords = [
    { change_id: "CHG001", change_type: "Addition", description: "Added GPS-denied navigation accuracy requirement R007 based on Nav-CONOPS review.", affected_element_ids: ["R007"], after_state: "Baselined", changed_utc: "2026-02-01T00:00:00Z", confidence: 0.90 },
    { change_id: "CHG002", change_type: "Modification", description: "Updated risk K004 status from Active to Mitigated after HITL decision acceptance.", affected_element_ids: ["K004"], before_state: "Active", after_state: "Mitigated", changed_utc: "2026-02-10T00:00:00Z", confidence: 0.88 },
  ];

  const mkRegister = (id: string, type: string, ids: string[], rule: string, confidence = 1.0): Register => ({
    register_id: id,
    register_type: type,
    member_ids: ids,
    completeness_rule: rule,
    confidence,
  });

  return {
    ledger_id: "LEDGER-POC5-001",
    version: "v1.0",
    created_utc: new Date().toISOString(),
    row_target: "2",
    sources,
    source_register: mkRegister("REG-SRC", "Source", sources.map(s => s.source_id), "This register SHALL contain the identifiers of ALL Source elements present in the ledger."),
    findings,
    findings_register: mkRegister("REG-FND", "Finding", findings.map(f => f.finding_id), "This register SHALL contain the identifiers of ALL Finding elements present in the ledger."),
    gaps,
    gap_register: mkRegister("REG-GAP", "Gap", gaps.map(g => g.gap_id), "This register SHALL contain the identifiers of ALL Gap elements present in the ledger."),
    zachman_cells: zachmanCells,
    zachman_cell_register: mkRegister("REG-ZC", "ZachmanCell", zachmanCells.map(z => z.cell_id), "This register SHALL contain the identifiers of ALL ZachmanCell elements present in the ledger."),
    traces,
    trace_register: mkRegister("REG-TRC", "Trace", traces.map(t => t.trace_id), "This register SHALL contain the identifiers of ALL Trace elements present in the ledger."),
    domains,
    domain_register: mkRegister("REG-DOM", "Domain", domains.map(d => d.domain_id), "This register SHALL contain the identifiers of ALL Domain elements present in the ledger."),
    requirements,
    requirement_register: mkRegister("REG-REQ", "Requirement", requirements.map(r => r.requirement_id), "This register SHALL contain the identifiers of ALL Requirement elements present in the ledger."),
    risks,
    active_risk_register: mkRegister("REG-RSK", "Risk", risks.filter(r => r.status === "Active").map(r => r.risk_id), "This register SHALL contain the identifiers of ALL Risk elements whose status is Active in the ledger."),
    issues,
    issue_register: mkRegister("REG-ISS", "Issue", issues.map(i => i.issue_id), "This register SHALL contain the identifiers of ALL Issue elements present in the ledger."),
    questions,
    question_register: mkRegister("REG-QST", "Question", questions.map(q => q.question_id), "This register SHALL contain the identifiers of ALL Question elements present in the ledger."),
    answers,
    answer_register: mkRegister("REG-ANS", "Answer", answers.map(a => a.answer_id), "This register SHALL contain the identifiers of ALL Answer elements present in the ledger."),
    assumptions,
    assumption_register: mkRegister("REG-ASM", "Assumption", assumptions.map(a => a.assumption_id), "This register SHALL contain the identifiers of ALL Assumption elements present in the ledger."),
    constraints,
    constraint_register: mkRegister("REG-CON", "Constraint", constraints.map(c => c.constraint_id), "This register SHALL contain the identifiers of ALL Constraint elements present in the ledger."),
    candidate_requirements: candidateRequirements,
    candidate_requirement_register: mkRegister("REG-CR", "CandidateRequirement", candidateRequirements.map(c => c.candidate_requirement_id), "This register SHALL contain the identifiers of ALL CandidateRequirement elements present in the ledger."),
    suggestions,
    suggestion_register: mkRegister("REG-SUG", "Suggestion", suggestions.map(s => s.suggestion_id), "This register SHALL contain the identifiers of ALL Suggestion elements present in the ledger."),
    decisions,
    decision_register: mkRegister("REG-DCS", "Decision", decisions.map(d => d.decision_id), "This register SHALL contain the identifiers of ALL Decision elements present in the ledger."),
    coverage_items: coverageItems,
    coverage_register: mkRegister("REG-COV", "CoverageItem", coverageItems.map(c => c.coverage_id), "This register SHALL contain the identifiers of ALL CoverageItem elements present in the ledger."),
    rules,
    evaluations,
    evaluation_register: mkRegister("REG-EVL", "Evaluation", evaluations.map(e => e.evaluation_id), "This register SHALL contain the identifiers of ALL Evaluation elements present in the ledger."),
    violations,
    violation_register: mkRegister("REG-VIO", "Violation", violations.map(v => v.violation_id), "This register SHALL contain the identifiers of ALL Violation elements present in the ledger."),
    analysis_passes: analysisPasses,
    stakeholders,
    stakeholder_register: mkRegister("REG-STK", "Stakeholder", stakeholders.map(s => s.stakeholder_id), "This register SHALL contain the identifiers of ALL Stakeholder elements present in the ledger."),
    narrative_summaries: narrativeSummaries,
    narrative_summary_register: mkRegister("REG-NS", "NarrativeSummary", narrativeSummaries.map(n => n.summary_id), "This register SHALL contain the identifiers of ALL NarrativeSummary elements present in the ledger."),
    segments,
    segment_register: mkRegister("REG-SEG", "Segment", segments.map(s => s.segment_id), "This register SHALL contain the identifiers of ALL Segment elements present in the ledger."),
    source_atoms: sourceAtoms,
    source_atom_register: mkRegister("REG-SA", "SourceAtom", sourceAtoms.map(a => a.atom_id), "This register SHALL contain the identifiers of ALL SourceAtom elements present in the ledger."),
    cell_content_items: cellContentItems,
    cell_content_item_register: mkRegister("REG-CCI", "CellContentItem", cellContentItems.map(c => c.content_item_id), "This register SHALL contain the identifiers of ALL CellContentItem elements present in the ledger."),
    cell_relationships: cellRelationships,
    cell_relationship_register: mkRegister("REG-CRL", "CellRelationship", cellRelationships.map(c => c.relationship_id), "This register SHALL contain the identifiers of ALL CellRelationship elements present in the ledger."),
    checklists,
    checklist_register: mkRegister("REG-CL", "Checklist", checklists.map(c => c.checklist_id), "This register SHALL contain the identifiers of ALL Checklist elements present in the ledger."),
    structural_representations: structuralRepresentations,
    structural_representation_register: mkRegister("REG-SR", "StructuralRepresentation", structuralRepresentations.map(s => s.representation_id), "This register SHALL contain the identifiers of ALL StructuralRepresentation elements present in the ledger."),
    control_artefacts: controlArtefacts,
    control_artefact_register: mkRegister("REG-CA", "ControlArtefact", controlArtefacts.map(c => c.artefact_id), "This register SHALL contain the identifiers of ALL ControlArtefact elements present in the ledger."),
    signals,
    signal_register: mkRegister("REG-SIG", "Signal", signals.map(s => s.signal_id), "This register SHALL contain the identifiers of ALL Signal elements present in the ledger."),
    concerns,
    concern_register: mkRegister("REG-CON2", "Concern", concerns.map(c => c.concern_id), "This register SHALL contain the identifiers of ALL Concern elements present in the ledger."),
    closure_matrices: closureMatrices,
    closure_matrix_register: mkRegister("REG-CM", "ClosureMatrix", closureMatrices.map(c => c.matrix_id), "This register SHALL contain the identifiers of ALL ClosureMatrix elements present in the ledger."),
    baselines,
    baseline_register: mkRegister("REG-BL", "Baseline", baselines.map(b => b.baseline_id), "This register SHALL contain the identifiers of ALL Baseline elements present in the ledger."),
    change_records: changeRecords,
    change_record_register: mkRegister("REG-CHG", "ChangeRecord", changeRecords.map(c => c.change_id), "This register SHALL contain the identifiers of ALL ChangeRecord elements present in the ledger."),
  };
}
