#!/usr/bin/env node
// Development probe: find how CapCut's upload ticket is exchanged for upload credentials.
// Remove before public release (tracked in PUBLIC_RELEASE_CHECKLIST.md).
//
// Usage: echo <upload_ticket> | node scripts/dev/probe-upload-ticket.mjs
//
// Reads the ticket from stdin so it never appears in process arguments. Tries each request
// format in turn, stops at the first one that is not rejected as an invalid ticket, and prints
// only the masked shape of each response. Credential values are never printed.

import fs from 'node:fs'

const ENDPOINT = 'https://www.capcut.com/api/external_mcp/upload/credential'
const SAFE_KEYS = new Set([
  'status', 'error', 'error_description', 'message', 'provider', 'region', 'upload_host', 'url',
  'space_name', 'image_service_id', 'app_id', 'current_time', 'expired_time', 'expires_at', 'version',
])

function mask(value, key = '') {
  if (Array.isArray(value)) return value.map(v => mask(v, key))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mask(v, k)]))
  if (typeof value === 'string' && !SAFE_KEYS.has(key)) return `<string, ${value.length} chars>`
  return value
}

const ticket = fs.readFileSync(0, 'utf8').trim()
if (!/^[A-Za-z0-9_-]{8,128}$/.test(ticket)) {
  console.error('Pipe a single upload_ticket on stdin.')
  process.exit(1)
}

const attempts = [
  { name: 'body upload_ticket', headers: {}, body: { upload_ticket: ticket } },
  { name: 'body upload_ticket + version 2', headers: {}, body: { upload_ticket: ticket, version: 2 } },
  { name: 'header Authorization Bearer', headers: { Authorization: `Bearer ${ticket}` }, body: {} },
  { name: 'header X-Upload-Ticket', headers: { 'X-Upload-Ticket': ticket }, body: {} },
  { name: 'body ticket', headers: {}, body: { ticket } },
]

for (const attempt of attempts) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...attempt.headers },
    body: JSON.stringify(attempt.body),
  })
  const text = await response.text()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = `<non-JSON body, ${text.length} chars>`
  }
  console.log(JSON.stringify({ attempt: attempt.name, http: response.status, response: mask(parsed) }, null, 2))
  if (parsed?.error !== 'invalid_upload_ticket') break
}
