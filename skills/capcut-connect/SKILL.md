---
name: capcut-connect
description: Connect Claude Code to a CapCut account and fix CapCut connection problems. Use when CapCut tools are missing, return an authentication error, the user asks how to log in or out of CapCut, or the CapCut login page shows an error.
---

# Connect to CapCut

claudecut uses two MCP servers hosted by CapCut:

| Server | Purpose | Login |
| --- | --- | --- |
| `capcut` | Account tools: search, generation, captions, rough cuts, uploads, drafts | OAuth with the user's CapCut account |
| `capcut-cards` | Display helpers such as template galleries | None |

Tools appear in Claude Code as `mcp__plugin_claudecut_capcut__<tool>` and `mcp__plugin_claudecut_capcut-cards__<tool>`. Match tools by the part after the last `__` so the workflow also works when a user added the servers by hand (for example `mcp__capcut__<tool>`).

## Check the connection

Run a free, read-only call: `search_capcut_material` with `type: "font"`, `prompt: "font"`, `top_n: 1`. A result means the account is connected. Never use a generation, upload or draft tool to test a connection.

## Log in

Claude cannot complete the login itself. Tell the user to:

1. Run `/mcp` in Claude Code.
2. Select **capcut** (it may show as `plugin:claudecut:capcut`) and choose **Authenticate**.
3. Sign in to CapCut in the browser window that opens, then return to Claude Code.

The login only works when Claude Code runs on the user's own computer. CapCut accepts local callback addresses only, so cloud sessions and the claude.ai website cannot finish it.

## Fix common problems

| Symptom | Cause and fix |
| --- | --- |
| `unknown client` or `invalid_request` on the login page | Region mismatch. A US internet connection needs a US-registered CapCut account and a non-US connection needs a non-US account. Sign out at capcut.com, sign in with a matching account, then authenticate again. |
| Browser shows "connection refused" on a `localhost` page | The login wait expired or a firewall blocked the local callback. Run **Authenticate** again and allow the local connection if the firewall asks. |
| HTTP 502 or Bad Gateway with no tool result | CapCut's service is temporarily down. Wait and retry later. Do not log out. |
| Each CapCut tool is listed twice | The servers were also added by hand. Remove the manual copies with `claude mcp remove capcut` and `claude mcp remove capcut-cards`. |
| Tools still missing after login | Run `/mcp` and choose **Reconnect** for capcut, or restart Claude Code. |

## Safety

- Never ask the user to paste passwords, cookies, tokens or authorization codes into the chat.
- Never read, print or edit stored OAuth credentials.
- After a successful login, return to the user's original request.
