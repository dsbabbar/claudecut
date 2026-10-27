---
name: capcut-connect
description: Connect Claude Code to a CapCut account, check that Node.js and ffmpeg are installed, and fix CapCut connection problems. Use when CapCut tools are missing, return an authentication error, the user asks how to log in or out of CapCut or how to set claudecut up, the CapCut login page shows an error, or a claudecut script cannot run because node or ffmpeg is missing.
---

# Connect to CapCut

claudecut uses two MCP servers hosted by CapCut:

| Server | Purpose | Login |
| --- | --- | --- |
| `capcut` | Account tools: search, generation, captions, rough cuts, uploads, drafts | OAuth with the user's CapCut account |
| `capcut-cards` | Display helpers such as template galleries | None |

Tools appear in Claude Code as `mcp__plugin_claudecut_capcut__<tool>` and `mcp__plugin_claudecut_capcut-cards__<tool>`. Match tools by the part after the last `__` so the workflow also works when a user added the servers by hand (for example `mcp__capcut__<tool>`).

## Setup check

claudecut's helper scripts need **Node.js 20 or later**. Uploads, draft editing, subtitle files and saving results all use it; searches and generation do not. **ffmpeg** (which includes ffprobe) is optional: it is used to detect portrait phone videos and to recover missed captions in mixed-language videos.

Run this check once per conversation, the first time a workflow needs a script or ffmpeg, or when the user asks to set claudecut up:

1. Run `node --version`. It must print `v20` or higher.
2. Only when ffmpeg would help the current request, run `ffprobe -version`.

If something is missing or too old, do not try to work around it. Tell the user what it is needed for and give the install command for their system, then wait for them to install it and restart Claude Code:

| System | Node.js | ffmpeg |
| --- | --- | --- |
| Windows | `winget install OpenJS.NodeJS.LTS` | `winget install Gyan.FFmpeg` |
| macOS (Homebrew) | `brew install node` | `brew install ffmpeg` |
| Linux | The current LTS from https://nodejs.org or your distribution's `nodejs` package, if it is version 20 or later | `sudo apt install ffmpeg` or your distribution's equivalent |

Do not install software yourself unless the user asks you to. When ffmpeg is missing, continue the request without the steps that need it and say which steps were skipped.

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
