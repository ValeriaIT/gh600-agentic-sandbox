# 🚀 GH-600 Exam Preparation Sandbox

A hands-on practice repository for the **GH-600: Developing in Agentic AI Systems** certification exam.

---

## 🗺️ Learning Roadmap

- [x] **PHASE 1: Project Setup & Structure**
  - [x] Create standardized directory tree (`.github/agents`, `prompts`, `workflows`, `src`)
  - [x] Configure global instructions in `.github/copilot-instructions.md`
  - [x] Setup `.gitignore` and `mcp-config.json` baseline

- [x] **PHASE 2: Custom Agent Definition & Guardrails Testing**
  - [x] Create custom agent `.github/agents/code-reviewer.agent.md`
  - [x] Configure YAML frontmatter (`name`, `description`, `tools`)
  - [x] Test read-only guardrails and human-in-the-loop behavior in VS Code

- [ ] **PHASE 3: GitHub Actions & Workflow Automation**
  - [x] Create workflow files in `.github/workflows/` (`approval.yml`, `code-review.yml`)[cite: 2]
  - [x] Configure execution triggers (`push`, `pull_request`, `workflow_dispatch`)[cite: 2]
  - [ ] Test the PR review workflow by opening a Pull Request
  - [ ] Test environment approval gates (`production` environment)

- [ ] **PHASE 4: Model Context Protocol (MCP) Integration**
  - [x] Define MCP architecture configuration (`mcp-config.json`)
  - [ ] Connect a live MCP server and query external context via agents

---

## 📋 Notes & Practice Logs

_Add your notes, error logs, and key findings here as you complete each phase._
