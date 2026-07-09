import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * Tiny JSON-file persistence helper for the starter demo.
 *
 * WHY THIS EXISTS: zero-setup, inspectable persistence so the template runs
 * anywhere with no database. It is intentionally simple and NOT production
 * storage. All access goes through a repository (see server/repositories/*),
 * so swapping this for a real DB (Drizzle/SQLite, Postgres, …) is a
 * single-file change that never touches API routes or the app.
 *
 * Concurrency: writes are serialized per-file with an in-process async lock so
 * two overlapping requests can't corrupt the file. (This does not guard against
 * multiple processes — fine for a single dev/preview server.)
 */

// Auto-imported in Nitro; kept as a normal export for testability.
const locks = new Map<string, Promise<unknown>>()

/** Serialize an async operation against a key (here: a file path). */
async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve()
  // Chain onto any in-flight op for this key; swallow prior errors for the gate.
  // Capture the guarded promise once so the finally-block identity check works.
  const guarded = prev.catch(() => undefined).then(fn)
  locks.set(key, guarded)
  try {
    return await guarded
  }
  finally {
    // Clean up if we were the last op queued for this key.
    if (locks.get(key) === guarded) locks.delete(key)
  }
}

/** Read a JSON file, returning `fallback` if it does not exist yet. */
export async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path, 'utf8')
    return JSON.parse(raw) as T
  }
  catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return fallback
    throw err
  }
}

/** Atomically-ish write a JSON file (serialized per path via the lock). */
export async function writeJson<T>(path: string, data: T): Promise<void> {
  await withLock(path, async () => {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, JSON.stringify(data, null, 2), 'utf8')
  })
}

/**
 * Read-modify-write a JSON collection under a single lock, so concurrent
 * mutations (create/update/delete) can't clobber each other.
 */
export async function updateJson<T>(
  path: string,
  fallback: T,
  mutate: (current: T) => T,
): Promise<T> {
  return withLock(path, async () => {
    const current = await readJson<T>(path, fallback)
    const next = mutate(current)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, JSON.stringify(next, null, 2), 'utf8')
    return next
  })
}
