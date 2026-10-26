# claudecut

**Unofficial CapCut plugin for Claude Code.** Turn ideas into polished videos by asking Claude to search CapCut templates, generate images and videos, add captions and music, and rough-cut your footage, all from a Claude Code session.

> **Not affiliated with CapCut or ByteDance.** claudecut is an independent, community-built project. It is an unofficial alternative to the official "CapCut x Codex" plugin for OpenAI Codex. CapCut is a trademark of its respective owner and is used here only to describe what this plugin connects to.

## How it works

CapCut runs a hosted [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for AI assistants. claudecut connects Claude Code to that server and adds Claude-specific skills (instructions that teach Claude the right workflows), plus local helpers for uploading media and editing drafts.

```
Claude Code ── claudecut plugin ──┬── capcut        (your CapCut account, OAuth login)
                                  └── capcut-cards  (result cards, no login)
```

All AI generation, search and editing run on CapCut's servers under **your own CapCut account**. claudecut does not run its own backend and never sees your password.

## Requirements

- [Claude Code](https://code.claude.com) 2.1.275 or later, running on your own computer (the CapCut login sends you back to a local address, so cloud and browser-only sessions cannot complete it)
- A CapCut account. Your account region must match your internet connection's region (a US connection needs a US-registered account).
- Node.js 20 or later for the media uploader

## Install

In Claude Code:

```
/plugin install claudecut --marketplace dsbabbar/claudecut
```

Then run `/mcp`, select **capcut**, and choose **Authenticate**. Sign in to CapCut in the browser window that opens.

If you previously added CapCut's servers by hand, remove them so each tool is listed once: `claude mcp remove capcut` and `claude mcp remove capcut-cards`.

## What you can ask for

| Feature | Example prompt | Status |
| --- | --- | --- |
| Template search | "Find fast-paced 9:16 product launch templates" | Ready to test |
| Image generation | "Generate four poster concepts for a summer sale" | Ready to test |
| Video generation | "Make a 5-second clip of waves at sunset" | Ready to test |
| Material search | "Find upbeat background music and a bold title font" | Ready to test |
| Auto captions | "Add English captions to this video and give me an SRT" | Ready to test with media already in CapCut; local files need uploads |
| AI rough cut | "Cut these clips into a 30-second highlight reel" | Needs local uploads (planned) |
| Local uploads | "Use ./footage/intro.mp4 as the reference" | Planned |
| Draft editing | "Add the music and captions to my draft" | Planned |

**Credits:** some features spend CapCut credits. claudecut always shows the quoted cost and waits for your approval before any paid generation.

## Development

```
npm test
claude plugin validate .
claude --plugin-dir .
```

Skills live in `skills/`, helper scripts in `scripts/` and tests in `tests/`.

## Privacy and terms

Your prompts, media and account data are sent to CapCut and handled under CapCut's [Privacy Policy](https://www.capcut.com/clause/privacy) and [Terms of Service](https://www.capcut.com/clause/terms-of-service). You are responsible for following those terms. claudecut itself collects no data.

## License

[MIT](LICENSE). This license covers the code in this repository only, not CapCut's service.
