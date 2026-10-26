#!/usr/bin/env node
// Convert caption cues to SRT or WebVTT.
//
// Input (stdin or --in): a JSON array of cues, or an object with a `cues` array.
// Each cue is { "start_ms": number, "end_ms": number, "text": string }.
//
// Usage:
//   node captions-to-subtitles.mjs --format srt|vtt [--in cues.json] [--out captions.srt]

import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

function parseArgs(argv) {
  const args = { format: 'srt', in: null, out: null }
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i]
    const value = argv[i + 1]
    if (name === '--format' || name === '--in' || name === '--out') {
      if (value === undefined) throw new Error(`${name} needs a value`)
      args[name.slice(2)] = value
      i++
    } else if (name === '--help' || name === '-h') {
      args.help = true
    } else {
      throw new Error(`Unknown argument: ${name}`)
    }
  }
  if (!['srt', 'vtt'].includes(args.format)) throw new Error('--format must be srt or vtt')
  return args
}

export function formatTimestamp(ms, separator) {
  const total = Math.max(0, Math.round(ms))
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  const millis = total % 1000
  const pad = (n, width = 2) => String(n).padStart(width, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${separator}${pad(millis, 3)}`
}

export function normalizeCues(data) {
  const list = Array.isArray(data) ? data : data?.cues
  if (!Array.isArray(list)) throw new Error('Input must be a JSON array of cues or an object with a "cues" array')
  return list.map((cue, index) => {
    const start = Number(cue.start_ms)
    const end = Number(cue.end_ms)
    const text = String(cue.text ?? '').trim()
    if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error(`Cue ${index + 1} needs numeric start_ms and end_ms`)
    if (end <= start) throw new Error(`Cue ${index + 1} ends before it starts`)
    if (!text) throw new Error(`Cue ${index + 1} has no text`)
    return { start, end, text }
  }).sort((a, b) => a.start - b.start)
}

export function toSubtitles(cues, format) {
  if (format === 'vtt') {
    const body = cues.map(c => `${formatTimestamp(c.start, '.')} --> ${formatTimestamp(c.end, '.')}\n${c.text}`)
    return `WEBVTT\n\n${body.join('\n\n')}\n`
  }
  const body = cues.map((c, i) => `${i + 1}\n${formatTimestamp(c.start, ',')} --> ${formatTimestamp(c.end, ',')}\n${c.text}`)
  return `${body.join('\n\n')}\n`
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log('Usage: captions-to-subtitles.mjs --format srt|vtt [--in cues.json] [--out file]')
    return
  }
  const raw = fs.readFileSync(args.in ?? 0, 'utf8')
  const output = toSubtitles(normalizeCues(JSON.parse(raw)), args.format)
  if (args.out) {
    fs.writeFileSync(args.out, output, 'utf8')
    console.log(JSON.stringify({ success: true, out: args.out }))
  } else {
    process.stdout.write(output)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main()
  } catch (error) {
    console.error(JSON.stringify({ success: false, error: error.message }))
    process.exit(1)
  }
}
