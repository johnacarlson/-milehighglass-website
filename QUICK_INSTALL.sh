#!/bin/bash
# Claude Code Skills — Quick Installation Script
# Run after you've set up Claude Code CLI

echo "Installing 5 Claude Code Skills..."

# 1. Superpowers (mandatory)
echo "1/5 Installing Superpowers..."
/usr/local/bin/claude-code /plugin install superpowers@claude-plugins-official || echo "Note: May need manual install from /plugin marketplace"

# 2. Playwright MCP (recommended for self-testing)
echo "2/5 Installing Playwright MCP..."
/usr/local/bin/claude-code --add-mcp playwright || npm install -g @playwright/mcp

# 3-5. Manual installs (search Claude plugins marketplace)
echo ""
echo "Next steps — search Claude plugins marketplace for:"
echo "  - 'Claude Audit' (Trail of Bits security analysis)"
echo "  - 'Minimal-Diff' or 'Carpentry' (surgical edits)"
echo "  - 'Superdesign' (design canvas UI generation)"
echo ""
echo "Or run these in Claude Code:"
echo "  /plugin install claude-audit"
echo "  /plugin install minimal-diff"
echo "  /plugin install superdesign"
