---
name: capcut-draft
description: Add, change or remove captions, music, sound effects, text, fonts, effects, filters and transitions in a CapCut cloud draft, and open the draft in the CapCut web editor. Use when the user wants to edit an existing CapCut draft or apply captions or materials to a video.
---

# Edit CapCut drafts

**Not available yet.** claudecut's draft editor is still being built.

Until it ships:

- Tell the user that editing CapCut drafts from Claude is not supported yet in this version of claudecut.
- Still deliver what can be produced without a draft: search results with links (`capcut-materials`), caption text or SRT/VTT files (`capcut-captions`), and rough-cut videos with their editor links (`capcut-rough-cut`). The user can then apply them in the CapCut editor.
- Never call `push_stdraft_snapshot` in this version. A malformed draft can damage the user's project.
