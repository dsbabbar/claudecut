import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { formatTimestamp, normalizeCues, toSubtitles } from '../scripts/captions-to-subtitles.mjs'

const script = fileURLToPath(new URL('../scripts/captions-to-subtitles.mjs', import.meta.url))
const cues = [
  { start_ms: 1500, end_ms: 3200, text: 'Second line' },
  { start_ms: 0, end_ms: 1400, text: 'First line' },
]

test('formats timestamps for SRT and VTT', () => {
  assert.equal(formatTimestamp(3_723_045, ','), '01:02:03,045')
  assert.equal(formatTimestamp(0, '.'), '00:00:00.000')
})

test('sorts cues and writes SRT', () => {
  assert.equal(
    toSubtitles(normalizeCues(cues), 'srt'),
    '1\n00:00:00,000 --> 00:00:01,400\nFirst line\n\n2\n00:00:01,500 --> 00:00:03,200\nSecond line\n',
  )
})

test('writes WebVTT and accepts a cues object', () => {
  assert.equal(
    toSubtitles(normalizeCues({ cues: [cues[1]] }), 'vtt'),
    'WEBVTT\n\n00:00:00.000 --> 00:00:01.400\nFirst line\n',
  )
})

test('rejects invalid cues', () => {
  assert.throws(() => normalizeCues([{ start_ms: 5, end_ms: 1, text: 'x' }]), /ends before it starts/)
  assert.throws(() => normalizeCues([{ start_ms: 0, end_ms: 1, text: ' ' }]), /no text/)
  assert.throws(() => normalizeCues({}), /JSON array/)
})

test('runs as a command reading stdin', () => {
  const out = execFileSync(process.execPath, [script, '--format', 'srt'], { input: JSON.stringify(cues) })
  assert.match(out.toString(), /^1\n00:00:00,000 --> 00:00:01,400\nFirst line/)
})
