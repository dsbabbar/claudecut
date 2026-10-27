# What's inside claudecut

claudecut is a **Claude Code plugin**. A plugin is a package that bundles several kinds of pieces so you can install them with one command. claudecut contains skills, scripts and a hook written for this project, plus the address of an MCP server that **CapCut runs**. claudecut does not include or run an MCP server of its own.

## The pieces

| Piece | What it is | Who made it | Where it lives |
| --- | --- | --- | --- |
| **Plugin** | The installable package that holds everything below | claudecut | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| **MCP servers** | Services that give Claude tools to call, such as "generate an image" or "search templates", running under your CapCut account | **CapCut**, on CapCut's servers | Only their addresses, in `.mcp.json` |
| **Skills** | Written instructions that teach Claude how to use those tools well, for example to quote credits before spending them or never to invent captions | claudecut (8 skills) | `skills/` |
| **Scripts** | Small Node.js programs for jobs CapCut's tools can't do alone: uploading files, editing drafts, writing subtitle files and saving results | claudecut (4 scripts) | `scripts/` |
| **Hook** | A command Claude Code runs automatically when a chat starts, to check that Node.js and ffmpeg are installed | claudecut | `hooks/` |

An analogy: CapCut's MCP server is the **kitchen**, the skills are the **recipes**, the scripts are **extra kitchen tools**, and the plugin is the **box** that delivers them all.

## How the pieces work together

```
You: "Add captions to clip.mp4"
 │
 ▼
Claude Code
 ├── skill: capcut-captions        tells Claude the steps and the rules
 ├── skill: capcut-upload          tells Claude how to upload the file
 │     └── script: capcut-upload.mjs        sends the file to CapCut
 ├── MCP tool (CapCut): auto_caption_submit / auto_caption_query
 └── script: captions-to-subtitles.mjs      writes the .srt file on your computer
```

1. You ask in plain words. Claude picks the skill whose description matches the request.
2. The skill explains which CapCut tools to call, in what order, and what to avoid.
3. Claude calls tools on **CapCut's MCP server** for the AI work: recognition, generation, search, rough cuts and drafts.
4. When a job needs your computer (reading a file, writing a file, editing a draft document), Claude runs one of claudecut's **scripts**.

## The two CapCut servers

| Server | Address | Login | What it provides |
| --- | --- | --- | --- |
| `capcut` | `https://www.capcut.com/api/external_mcp` | Your CapCut account (OAuth) | Search, generation, captions, rough cuts, upload permission, draft sessions |
| `capcut-cards` | `https://www.capcut.com/api/external_mcp/resource` | None | Display helpers such as template galleries |

CapCut built these servers for AI assistants. The official CapCut x Codex plugin connects to the same servers. claudecut uses them from Claude Code with its own skills and scripts.

## The skills

| Skill | Used when you want to |
| --- | --- |
| `capcut-connect` | Sign in, check setup (Node.js, ffmpeg) or fix connection problems |
| `capcut-templates` | Find CapCut templates and editing ideas |
| `capcut-materials` | Find music, sound effects, fonts and effects |
| `capcut-generate` | Generate images or short videos, with credit quotes first |
| `capcut-captions` | Transcribe speech and get captions or SRT/VTT files |
| `capcut-rough-cut` | Have CapCut's AI cut footage into a first edit |
| `capcut-upload` | Send local videos, audio and images to CapCut |
| `capcut-draft` | Add or change text, captions, music and clips in a CapCut draft |

You don't need to name a skill. Describe what you want, and Claude picks the right one.

## The scripts

| Script | What it does |
| --- | --- |
| `scripts/capcut-upload.mjs` | Exchanges CapCut's short-lived upload ticket for upload keys inside the script, uploads files and returns their IDs. The keys are never printed. |
| `scripts/stdraft.mjs` | Creates, summarizes, validates and edits CapCut draft documents (STDraft) on your computer |
| `scripts/captions-to-subtitles.mjs` | Turns caption timings into SRT or WebVTT files |
| `scripts/download-media.mjs` | Saves generated images and videos from expiring links to a local folder |

They use only Node.js's built-in modules, so there is nothing to `npm install`.

## The hook

`hooks/check-setup.sh` runs when a chat starts. It prints nothing when Node.js 20+ and ffmpeg are installed. If something is missing, it adds a short note so Claude tells you and offers to install it (with your approval) or to show you the steps.

## Skills, MCP servers and plugins in general

- An **MCP server** gives an AI assistant **abilities** (tools). It can run on your computer or on a company's servers.
- A **skill** gives an AI assistant **know-how**: when and how to use those abilities, written as instructions. Skills don't run anything by themselves.
- A **plugin** is how Claude Code **packages and installs** skills, MCP server connections, hooks, scripts and commands together.

A plugin can contain any mix of these. claudecut contains everything except its own MCP server, because CapCut already provides one.
