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
- Node.js 20 or later for uploads, downloads and subtitle export

## Install

In Claude Code:

```
/plugin install claudecut --marketplace dsbabbar/claudecut
```

Then run `/mcp`, select **capcut**, and choose **Authenticate**. Sign in to CapCut in the browser window that opens.

Uploading local files uses CapCut's `capcut_asset_upload_credential` tool, which issues short-lived upload credentials. Claude Code asks before running it. Approve it when asked, or allow it permanently with `/permissions`.

If you previously added CapCut's servers by hand, remove them so each tool is listed once: `claude mcp remove capcut` and `claude mcp remove capcut-cards`.

Not sure whether claudecut or editing CapCut's local project files fits your project better? See [Choosing a workflow](docs/choosing-a-workflow.md).

## What you can ask for

| Feature | Example prompt | Status |
| --- | --- | --- |
| Template search | "Find fast-paced 9:16 product launch templates" | Available |
| Image generation | "Generate four poster concepts for a summer sale" | Available |
| Video generation | "Make a 5-second clip of waves at sunset" | Available |
| Material search | "Find upbeat background music and a bold title font" | Available |
| Auto captions | "Add English captions to this video and give me an SRT" | Available |
| AI rough cut | "Cut these clips into a 30-second highlight reel" | Available |
| Local uploads | "Use ./footage/intro.mp4 as the reference" | Available |
| Draft editing | "Add the music and captions to my draft" | Available |

**Credits:** some features spend CapCut credits. claudecut always shows the quoted cost and waits for your approval before any paid generation.

**Saving results:** result links are temporary. Ask Claude to save generated images and videos, and they are downloaded to a `capcut-output` folder in your current directory. CapCut may add an "AI" watermark to generated media.

## Known limitations

- **Claude Code only.** CapCut's login accepts local callback addresses only, so the claude.ai website and cloud sessions cannot connect. CapCut's interactive cards are not shown; claudecut asks questions and shows results in the chat instead.
- **Draft editing** covers text, captions, music, sound effects and main-track video clips. Filters, transitions, effects, text templates, stickers and picture-in-picture must be added in the CapCut web editor for now.
- **Captions for mixed-language videos** may miss short phrases in the second language. claudecut never fills gaps with its own translation; it tells you which parts have no captions.
- **Emoji** in draft text may appear as plain monochrome symbols in CapCut's editor.
- **AI rough cuts** may use subscription credits and do not show a quote before starting.
- **Upload permission:** Claude Code asks before running CapCut's upload-credential tool, because it issues short-lived upload keys.

## Development

```
npm test
claude plugin validate .
claude --plugin-dir .
```

Skills live in `skills/`, helper scripts in `scripts/` and tests in `tests/`.

## Acknowledgements

The uploader is an independent implementation. Volcengine's open-source [Node.js SDK](https://github.com/volcengine/volc-sdk-nodejs) (Apache-2.0) served as a reference for the VOD and ImageX upload protocols.

## Privacy and terms

Your prompts, media and account data are sent to CapCut and handled under CapCut's [Privacy Policy](https://www.capcut.com/clause/privacy) and [Terms of Service](https://www.capcut.com/clause/terms-of-service). You are responsible for following those terms. claudecut itself collects no data.

## License

[MIT](LICENSE). This license covers the code in this repository only, not CapCut's service.
