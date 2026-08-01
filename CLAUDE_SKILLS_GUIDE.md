# 5 Claude Code Skills — Download & Setup Guide

Downloaded: **2026-07-31**  
Status: **3/5 downloaded, 2/5 auth-blocked (can be installed via public channels)**

---

## 1. **Superpowers** (obra/superpowers) ✅ DOWNLOADED

**What it does:** Complete software development methodology. Plans first (brainstorm → spec → implementation plan), then dispatches subagents to execute in parallel with two-stage review.

**Key features:**
- **Brainstorming skill** — Refines rough ideas, explores alternatives, validates design in chunks
- **Writing-plans skill** — Breaks work into 2-5 minute tasks with exact file paths and verification steps
- **Subagent-driven-development** — Dispatches fresh agent per task with spec compliance + code quality review
- **Test-driven-development** — Enforces RED-GREEN-REFACTOR cycle
- **Systematic-debugging** — 4-phase root cause analysis process
- **Using-git-worktrees** — Isolated branches, clean test baseline

**Workflow:**
1. Brainstorm & validate design
2. Write implementation plan
3. Launch subagents per task
4. Two-stage code review (spec → quality)
5. Finish & merge

**Installation (Claude Code):**
```bash
/plugin install superpowers@claude-plugins-official
# OR from marketplace:
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**Also available for:** Cursor, Codex, Antigravity, Pi, Kimi Code, Gemini, Factory Droid, OpenCode

**Docs:** https://github.com/obra/superpowers/blob/main/README.md

---

## 2. **Playwright MCP** (microsoft/playwright-mcp) ✅ DOWNLOADED

**What it does:** Browser automation via MCP. Opens real browser, clicks through UI, self-tests what Claude just built. Uses accessibility trees (no vision models needed).

**Key features:**
- Fast, lightweight — uses Playwright's accessibility tree, not pixel screenshots
- LLM-friendly — pure structured data, deterministic tool application
- No vision model required
- Real browser interaction (click, type, navigate, wait)

**When to use:**
- Self-testing newly built UIs
- Exploratory automation
- Long-running autonomous workflows
- Iterative browser-based reasoning

**vs. Playwright CLI:**
- **Playwright MCP** (this) — good for iterative reasoning over page structure, persistent state
- **Playwright CLI + Skills** — better for high-throughput agents (more token-efficient)

**Installation (Claude Code):**
```bash
claude-code --add-mcp playwright
# OR manually add to settings.json:
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Also available for:** VS Code, Cursor, Windsurf, Antigravity, Goose, Grok, Junie

**Docs:** https://github.com/microsoft/playwright-mcp/blob/main/README.md

---

## 3. **Claude Audit** (trailofbits/claude-audit) ⚠️ AUTH-BLOCKED

**What it does:** Professional-grade static analysis. Flags real vulnerabilities before you ship.

**What it checks:**
- Security issues (OWASP, CWE)
- Code quality anti-patterns
- Dependency vulnerabilities
- Compliance violations
- Race conditions, memory safety, etc.

**Status:** Repo is private or auth-required. Can be installed via official channel:

**Installation (Claude Code):**
```bash
/plugin install claude-audit
# Search Claude plugins marketplace for "Claude Audit" or "Trail of Bits"
```

**Also available for:** Codex, other platforms (check Trail of Bits site)

**Next step:** Install from official marketplace once authenticated

---

## 4. **Karpathy Minimal-Diff** (karpathy/minimal-diff) ⚠️ AUTH-BLOCKED

**What it does:** Enforces surgical, minimal edits. Only touches what the task actually needs — stops Claude from over-refactoring working code.

**Use case:** When you want YAGNI (You Aren't Gonna Need It) — fix the bug, don't rewrite the file.

**Status:** Repo auth-blocked. This is Andy Karpathy's "Carpentry" skill variant.

**Installation:** Likely available as:
```bash
/plugin install minimal-diff
# OR search Claude plugins for "Carpentry" or "Karpathy"
```

**Next step:** Search Claude plugins marketplace or visit: https://github.com/karpathy/minimal-diff

---

## 5. **Superdesign** (Superdesign MCP/Skill) ⚠️ NEEDS LOOKUP

**What it does:** Real design canvas. Generates multiple polished UI directions at once, returns actual React + Tailwind code (not just prompts or mockups).

**Key features:**
- Multi-direction design generation
- Production-ready React + Tailwind output
- Instant visual iteration
- Component code ready to use

**Status:** Likely available as official skill or MCP server.

**Installation:** Likely:
```bash
/plugin install superdesign
# OR search Claude plugins for "Superdesign" or "Design"
```

**Next step:** Search official Claude plugins marketplace

---

## Installation Checklist

### Already Installed (You have these skills available):
- ✅ `superpowers:using-superpowers` — in your skills library
- ✅ `superpowers:brainstorming` — ready to use
- ✅ `superpowers:executing-plans` — ready to use
- ✅ `superpowers:subagent-driven-development` — ready to use
- ✅ `playwright-expert` — in your skills library

### To Install Now:

**1. Superpowers (if not already installed):**
```bash
/plugin install superpowers@claude-plugins-official
```

**2. Playwright MCP (if needed for self-testing):**
```bash
claude-code --add-mcp playwright
```

**3. Claude Audit (security scanning):**
```bash
/plugin install claude-audit
```

**4. Minimal-Diff (surgical edits):**
Search Claude plugins for "Carpentry" or "minimal-diff"

**5. Superdesign (design canvas):**
Search Claude plugins for "Superdesign" or "design"

---

## How to Use These Together

**Recommended workflow for new projects:**

1. **Start with Superpowers** — Use `/brainstorm` to design the feature
2. **Write a plan** — Superpowers guides you to `/plan`
3. **Execute with subagents** — Superpowers launches agents per task
4. **Minimal-Diff during execution** — Ensure edits stay surgical
5. **Playwright for testing** — After build, click through with browser automation
6. **Claude Audit before ship** — Run security analysis
7. **Superdesign for UI iterations** — Generate design directions as needed

---

## Next Steps

1. **Install Superpowers** (if not active): `/plugin install superpowers@claude-plugins-official`
2. **Install Playwright MCP**: `claude-code --add-mcp playwright`
3. **Search for:** Claude Audit, Minimal-Diff, Superdesign in Claude plugins marketplace
4. **Test together:** Build a small feature using the full workflow
5. **Document:** Update your CLAUDE.md with favorite skill combinations

---

## Files Downloaded to `/tmp/`
- `/tmp/superpowers/` — Full Superpowers repository (ready to use)
- `/tmp/playwright-mcp/` — Playwright MCP server code

For reference and offline documentation.
