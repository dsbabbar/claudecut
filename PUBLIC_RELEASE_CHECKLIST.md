# Public release checklist

Work through this before announcing claudecut publicly. Delete this file in the final release commit.

## Files and folders to remove before release

| Path | Why it exists | Action |
| --- | --- | --- |
| `PUBLIC_RELEASE_CHECKLIST.md` | This checklist | Delete in the release commit |

## Rules for everything in this repo

- [ ] No files, text or code copied from the official CapCut Codex plugin (its bundle is marked `UNLICENSED`, which means proprietary). Everything here must be original work.
- [ ] No CapCut or ByteDance logos, icons or brand colors. Use an original icon.
- [ ] No captured tool schemas, server responses, draft snapshots or media from a real CapCut account committed as fixtures. Synthetic test data only.
- [ ] No tokens, cookies, client IDs, emails or personal paths (for example `C:\Users\...`) anywhere in the history.
- [ ] README and `plugin.json` both say "unofficial" and "not affiliated with CapCut or ByteDance".

## Release readiness

- [ ] `claude plugin validate .` passes with no errors
- [ ] Original square icon added (512 to 2048 px PNG at `.claude-plugin/icon.png`)
- [ ] `privacyPolicyUrl` set in `plugin.json`
- [ ] Each README feature marked "In progress" tested end to end and updated to "Available"
- [ ] Fresh install tested on Windows and macOS with `/plugin install claudecut --marketplace dsbabbar/claudecut`
- [ ] Git history checked with `git log -p` for anything in the rules above
