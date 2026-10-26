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

For curated types, the prompt does not change the results. Tell the user plainly that CapCut returned its curated list for their account rather than results matched to their request. If the results look generic (unrelated titles, one artist, no descriptions), music is curated for this account too, so say so.

## Present results

Show a numbered list with each item's title, the description CapCut returned, duration for audio, and a preview link when one is returned. Keep each item's `resource_id` and any `stdraft_uri` in the conversation for later use.

Describe only what the result says. Never guess a track's mood, tempo or sound from its title, and never rank items by how well they fit when the results carry no descriptive information. If you can't tell which items fit, say so and suggest the user listen to them in CapCut.

Do not invent materials. If nothing fits, say so and suggest a different description.

## Adding materials to a video

Check the `capcut-draft` skill before offering this. While it says draft editing is not available, do not offer to add materials to a draft or video. Instead, tell the user they can add the chosen item in the CapCut editor by searching its title there.
