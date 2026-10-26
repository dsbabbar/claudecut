---
name: capcut-materials
description: Find CapCut music, sound effects, fonts, text effects, text templates, video effects, face effects, transitions and filters. Use when the user wants background music, a sound effect, a font or a visual effect from CapCut's library, either to browse or to add to a draft.
---

# Search CapCut materials

Call `search_capcut_material` with:

- `type` (required): one of `music`, `sound_effect`, `font`, `text_effect`, `text_template`, `video_effect`, `face_effect`, `transition`, `filter`
- `prompt` (required): a short description of what the user wants, such as "upbeat lo-fi for a product demo"
- `top_n`: 1 to 20, default 5

## How the search behaves

Only some types search by `prompt`:

| Searches by prompt | Returns a fixed curated list |
| --- | --- |
| `sound_effect`, `video_effect`, and `music` in most regions | `font`, `text_effect`, `text_template`, `face_effect`, `transition`, `filter`, and `music` for US accounts |

For curated types, the prompt does not change the results. Request a larger `top_n` and pick the best fits yourself from the titles and descriptions, and tell the user you chose from a curated list.

## Present results

Show a numbered list with each item's title, a short description, duration for audio, and a preview link when one is returned. Keep each item's `resource_id` and any `stdraft_uri` in the conversation. The `capcut-draft` skill needs them to add the material to a draft.

Do not invent materials. If nothing fits, say so and suggest a different description.

If the user asks to add a material to a video, finish the search, then follow the `capcut-draft` skill.
