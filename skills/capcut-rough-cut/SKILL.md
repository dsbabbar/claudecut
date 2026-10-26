---
name: capcut-rough-cut
description: Create an AI rough cut with CapCut from video clips and images, such as cutting footage to a target length, assembling a highlight reel or restructuring a video's story. Use only when the user wants footage cut, assembled or restructured, not for adding captions or music to an unchanged video.
---

# AI rough cut with CapCut

CapCut's editing agent builds a first cut from uploaded clips and images, sometimes asking for decisions along the way.

## Inputs

- **Media:** each clip or image must be uploaded with the `capcut-upload` skill first. Videos use their `vid` and images their ImageX `uri` as `resource_id`. Each needs a unique `file_name` with its extension. Supported formats: videos avi, flv, m4v, mkv, mov, mp4, webm; images jpg, jpeg, png, webp.
- **Instructions:** what to make, including target length, platform, style, story and pacing, in the user's words.

## Workflow

1. Call `capcut_ailab_start_edit` with `assets` (in the user's order) and `query`. Keep the returned editing `session_id`.
2. Call `capcut_ailab_poll_edit_progress` with `session_id` and `after_event_id: "0"`. After each response, use its `next_event_id` for the next poll. Poll until the task finishes or needs input, and pass on progress messages briefly.
3. **When the task asks for a decision** (an editing plan or a question), show the user the plan and the available options in plain text and wait for their answer. Then call `capcut_ailab_submit_plan_response` with `session_id`, the current `after_event_id`, the user's exact choice as `response_text`, and the plan's `card_id` when one was given. Resume polling.
4. **When a video is ready,** show the user its preview link, duration and any editor link. Optionally call `video_preview` (on `capcut-cards`) with the event's `context` and `resources` unchanged to get the finished draft. Keep the editing `session_id`, the event ID and the draft for follow-up work.

Never submit the same plan response twice. If unsure whether a response went through, poll first.

## Follow-up

- To restructure the story, start a new rough cut. It does not pick up later manual or caption edits.
- To add captions, music or effects to the result, check the `capcut-draft` skill first. While it says draft editing is not available, do not offer this. Point the user to the editor link instead.
- An editing `session_id` from this skill is not a draft `session_id`. Do not mix them up.
