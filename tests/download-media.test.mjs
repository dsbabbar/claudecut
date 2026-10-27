import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { download, extensionFor, normalizeItems, safeBaseName } from '../scripts/download-media.mjs'

function fakeFetch(responses) {
  return async url => {
    const entry = responses[url]
    if (!entry) return new Response('missing', { status: 404 })
    return new Response(entry.body, { status: 200, headers: { 'content-type': entry.type } })
  }
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'promptcut-test-'))
}

test('accepts strings, objects and an items wrapper', () => {
  assert.deepEqual(normalizeItems(['https://a.example/x.png']), [{ url: 'https://a.example/x.png', name: 'capcut-1' }])
  assert.deepEqual(normalizeItems({ items: [{ url: 'https://a.example/y', name: 'cup' }] }), [{ url: 'https://a.example/y', name: 'cup' }])
})

test('rejects non-https and invalid urls', () => {
  assert.throws(() => normalizeItems(['http://a.example/x.png']), /https/)
  assert.throws(() => normalizeItems([{ url: 'not a url' }]), /invalid url/)
  assert.throws(() => normalizeItems([]), /non-empty/)
})

test('makes safe file names', () => {
  assert.equal(safeBaseName('../../etc/passwd'), 'etc-passwd')
  assert.equal(safeBaseName('Coffee cup: sunny table.png'), 'Coffee-cup-sunny-table')
  assert.equal(safeBaseName('...'), 'capcut')
})

test('picks extensions from content type, then url', () => {
  assert.equal(extensionFor('image/jpeg; charset=binary', 'https://a.example/x'), '.jpg')
  assert.equal(extensionFor('application/octet-stream', 'https://a.example/clip.MP4?sig=1'), '.mp4')
  assert.equal(extensionFor(null, 'https://a.example/x'), '.bin')
})

test('downloads files without overwriting and reports failures', async () => {
  const dir = tempDir()
  fs.writeFileSync(path.join(dir, 'cup.png'), 'existing')
  const items = normalizeItems([
    { url: 'https://cdn.example/1', name: 'cup' },
    { url: 'https://cdn.example/missing', name: 'gone' },
  ])
  const result = await download(items, dir, fakeFetch({ 'https://cdn.example/1': { body: 'PNGDATA', type: 'image/png' } }))
  assert.equal(result.success, false)
  assert.equal(result.files.length, 1)
  assert.equal(path.basename(result.files[0].path), 'cup-2.png')
  assert.equal(fs.readFileSync(result.files[0].path, 'utf8'), 'PNGDATA')
  assert.equal(fs.readFileSync(path.join(dir, 'cup.png'), 'utf8'), 'existing')
  assert.deepEqual(result.errors, [{ url: 'https://cdn.example/missing', error: 'HTTP 404' }])
})
