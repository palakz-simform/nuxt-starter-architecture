#!/usr/bin/env bash
# PostToolUse hook — auto-fix lint on the file Claude just edited so
# AI-generated code stays on-style without a manual step.
#
# It reads the hook payload from stdin, extracts the edited file path, and runs
# `eslint --fix` on it when the extension is lintable. It ALWAYS exits 0 so a
# lint issue never blocks an edit (the real gate is `npm run lint` / CI).
set -uo pipefail

input="$(cat)"

# Extract tool_input.file_path from the JSON payload using Node (always present
# in a Nuxt toolchain). Falls back to empty string on any parse failure.
file="$(printf '%s' "$input" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d);process.stdout.write((j.tool_input&&j.tool_input.file_path)||"")}catch(e){process.stdout.write("")}})' 2>/dev/null)"

[ -z "$file" ] && exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.mjs | *.cjs | *.vue) ;;
  *) exit 0 ;;
esac

[ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
npx eslint --fix "$file" >/dev/null 2>&1 || true
exit 0
