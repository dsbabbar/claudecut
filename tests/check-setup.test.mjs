import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../hooks/check-setup.sh', import.meta.url))
const skip = process.platform === 'win32' && 'uses POSIX symlinks for a fake PATH'

// Builds a PATH holding only the tools the script needs, plus optional fake node/ffprobe.
function fakePath({ node, ffprobe }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'claudecut-path-'))
  for (const tool of ['sh', 'sed', 'printf']) {
    const real = execFileSync('sh', ['-c', `command -v ${tool}`]).toString().trim()
    if (real.startsWith('/')) fs.symlinkSync(real, path.join(dir, tool))
  }
  if (node) fs.writeFileSync(path.join(dir, 'node'), `#!/bin/sh\necho ${node}\n`, { mode: 0o755 })
  if (ffprobe) fs.writeFileSync(path.join(dir, 'ffprobe'), '#!/bin/sh\necho ffprobe\n', { mode: 0o755 })
  return dir
}

function run(env) {
  return execFileSync('/bin/sh', [script], { env: { ...env }, encoding: 'utf8' })
}

test('is silent when Node.js 20+ and ffmpeg are installed', { skip }, () => {
  assert.equal(run({ PATH: fakePath({ node: 'v22.1.0', ffprobe: true }) }), '')
})

test('reports a missing or old Node.js as required', { skip }, () => {
  const none = run({ PATH: fakePath({ ffprobe: true }) })
  assert.match(none, /Required: Node\.js is not installed/)
  assert.doesNotMatch(none, /Optional/)
  assert.match(run({ PATH: fakePath({ node: 'v18.19.0', ffprobe: true }) }), /v18\.19\.0, but claudecut needs version 20/)
})

test('reports missing ffmpeg as optional unless silenced', { skip }, () => {
  const out = run({ PATH: fakePath({ node: 'v20.0.0' }) })
  assert.match(out, /Optional: ffmpeg/)
  assert.doesNotMatch(out, /Required/)
  assert.equal(run({ PATH: fakePath({ node: 'v20.0.0' }), CLAUDECUT_SKIP_FFMPEG_CHECK: '1' }), '')
})
