---
name: capcut-captions
description: Transcribe speech in a video or audio file and produce captions or subtitles with CapCut, including SRT or VTT files. Use for "add captions", "generate subtitles", "transcribe this video" and similar requests. Do not use an AI rough cut for caption-only requests.
---

# Automatic captions with CapCut

Caption-only requests keep the original video unchanged. Never start an AI rough cut to add captions.

## Inputs

Each media item needs either:

- a CapCut video or audio `vid` (from the `capcut-upload` skill or earlier work), or
- a `workspace_id` and `resource_id` pair from CapCut.

Upload local files first with `capcut-upload`. Each item also needs a `language` for the speech, for example `en-US`. Use the language the user gives. If none is given and you cannot tell from context, ask.

## Workflow

1. **Draft session.** Reuse this conversation's `draft_session_id`, or call `start_stdraft_session`.
2. **Choose a batch key.** Create a `unique_key` of letters, digits, `.`, `_` or `-`, at most 64 characters, for example `captions-20261026-1`. Use one key per batch and keep it. Reuse the same key when retrying the same batch so it is not recognized twice.
3. **Submit.** Call `auto_caption_submit` with `draft_session_id`, `unique_key` and `resources`.
4. **Poll.** Call `auto_caption_query` with the `unique_key` until every item is finished. Tell the user progress for long media.
5. **Deliver.**
   - For subtitle files, convert each caption line in the result to a cue `{"start_ms": ..., "end_ms": ..., "text": ...}` (times in milliseconds from the start of the media), write the cues as a JSON array to a temporary file, then run `node "${CLAUDE_PLUGIN_ROOT}/scripts/captions-to-subtitles.mjs" --format srt --in <cues.json> --out <name>.srt` (use `--format vtt` for WebVTT). Write one file per media item and tell the user where each file is.
   - To show the text, print the captions with their timestamps.
   - To burn captions into the video, keep the result and follow the `capcut-draft` skill.

If some items fail, report each failed item and keep the successful results. If a membership or purchase prompt is returned, give the user the link and wait.
