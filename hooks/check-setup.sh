#!/usr/bin/env sh
# claudecut SessionStart check. Prints nothing when Node.js 20+ and ffmpeg are installed.
# When something is missing, prints a note that Claude Code adds to the session context.

missing_node=""
node_version=""
if command -v node >/dev/null 2>&1; then
  node_version=$(node --version 2>/dev/null)
  major=$(printf '%s' "$node_version" | sed -n 's/^v\([0-9][0-9]*\).*/\1/p')
  if [ -z "$major" ] || [ "$major" -lt 20 ]; then
    missing_node="Node.js is ${node_version:-an unknown version}, but claudecut needs version 20 or later."
  fi
else
  missing_node="Node.js is not installed."
fi

missing_ffmpeg=""
if [ "${CLAUDECUT_SKIP_FFMPEG_CHECK:-}" != "1" ] && ! command -v ffprobe >/dev/null 2>&1 && ! command -v ffprobe.exe >/dev/null 2>&1; then
  missing_ffmpeg="ffmpeg (with ffprobe) is not installed."
fi

[ -z "$missing_node" ] && [ -z "$missing_ffmpeg" ] && exit 0

echo "claudecut setup check:"
[ -n "$missing_node" ] && echo "- Required: $missing_node Uploads, draft editing, subtitle export and saving results will not work until it is installed. Searches and generation still work."
[ -n "$missing_ffmpeg" ] && echo "- Optional: $missing_ffmpeg It is only used to detect portrait phone videos and to recover missed captions in mixed-language videos. The user can silence this reminder by setting the environment variable CLAUDECUT_SKIP_FFMPEG_CHECK=1."
echo "Follow the capcut-connect skill's Setup check: at the start of your first reply, tell the user briefly what is missing and what it is for, offer to install it for them or to show the steps, and wait for their answer. Mention a missing optional item only once, and do not repeat this note in later replies."
exit 0
