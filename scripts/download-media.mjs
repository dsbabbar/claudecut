#!/usr/bin/env node
// Download generated CapCut media to a local folder.
//
// Input (stdin or --in): a JSON array of items, or an object with an `items` array.
// Each item is { "url": "https://...", "name": "optional-base-name" }.
//
// Usage:
//   node download-media.mjs --out ./capcut-output [--in items.json]
//
// Prints one JSON object: { success, files: [{ url, path, bytes }], errors: [{ url, error }] }.
// Only https URLs are accepted, files are never overwritten, and each file is limited to 1 GiB.

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const MAX_BYTES = 1024 ** 3

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/heic': '.heic',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
  'audio/mpeg': '.mp3',
  'audio/mp4': '.m4a',
  'audio/wav': '.wav',
}

function parseArgs(argv) {
  const args = { out: null, in: null }
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i]
    const value = argv[i + 1]
    if (name === '--out' || name === '--in') {
      if (value === undefined) throw new Error(`${name} needs a value`)
      args[name.slice(2)] = value
      i++
    } else if (name === '--help' || name === '-h') {
      args.help = true
    } else {
      throw new Error(`Unknown argument: ${name}`)
    }
  }
  if (!args.help && !args.out) throw new Error('--out is required')
  return args
}

export function normalizeItems(data) {
  const list = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(list) || list.length === 0) throw new Error('Input must be a non-empty JSON array of items or an object with an "items" array')
  return list.map((item, index) => {
    const raw = typeof item === 'string' ? item : item?.url
    let url
    try {
      url = new URL(raw)
    } catch {
      throw new Error(`Item ${index + 1} has an invalid url`)
    }
    if (url.protocol !== 'https:') throw new Error(`Item ${index + 1} must use https`)
    const name = typeof item === 'object' && item.name ? String(item.name) : `capcut-${index + 1}`
    return { url: url.href, name }
  })
}

export function safeBaseName(name) {
  const cleaned = name
    .replace(/\.[A-Za-z0-9]{1,5}$/, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80)
  return cleaned || 'capcut'
}

export function extensionFor(contentType, url) {
  const type = (contentType ?? '').split(';')[0].trim().toLowerCase()
  if (EXTENSIONS[type]) return EXTENSIONS[type]
  const match = new URL(url).pathname.match(/\.([A-Za-z0-9]{2,5})$/)
  return match ? `.${match[1].toLowerCase()}` : '.bin'
}

export function uniquePath(dir, base, ext) {
  let candidate = path.join(dir, `${base}${ext}`)
  for (let n = 2; fs.existsSync(candidate); n++) candidate = path.join(dir, `${base}-${n}${ext}`)
  return candidate
}

export async function download(items, outDir, fetchImpl = fetch) {
  fs.mkdirSync(outDir, { recursive: true })
  const files = []
  const errors = []
  for (const item of items) {
    try {
      const response = await fetchImpl(item.url, { redirect: 'follow' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (response.url && new URL(response.url).protocol !== 'https:') throw new Error('Redirected to a non-https URL')
      const declared = Number(response.headers.get('content-length'))
      if (declared > MAX_BYTES) throw new Error('File is larger than 1 GiB')
      const body = Buffer.from(await response.arrayBuffer())
      if (body.length > MAX_BYTES) throw new Error('File is larger than 1 GiB')
      const target = uniquePath(outDir, safeBaseName(item.name), extensionFor(response.headers.get('content-type'), item.url))
      fs.writeFileSync(target, body, { flag: 'wx' })
      files.push({ url: item.url, path: target, bytes: body.length })
    } catch (error) {
      errors.push({ url: item.url, error: error.message })
    }
  }
  return { success: errors.length === 0, files, errors }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log('Usage: download-media.mjs --out <folder> [--in items.json]')
    return
  }
  const items = normalizeItems(JSON.parse(fs.readFileSync(args.in ?? 0, 'utf8')))
  const result = await download(items, path.resolve(args.out))
  console.log(JSON.stringify(result))
  if (!result.success) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(JSON.stringify({ success: false, error: error.message }))
    process.exit(1)
  })
}
