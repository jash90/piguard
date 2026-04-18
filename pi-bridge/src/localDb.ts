import Database from 'better-sqlite3'
import { config } from './config.js'

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    db = new Database(config.ftlDbPath, { readonly: true })
  }
  return db
}

export interface DnsLogEntry {
  id: number
  timestamp: number
  domain: string
  clientIp: string
  clientMac: string
  queryType: string
  status: string
}

// Get DNS logs since a given ID (cursor-based pagination)
export function getLogsSince(sinceId: number): DnsLogEntry[] {
  const db = getDb()

  try {
    const rows = db
      .prepare(
        `
      SELECT
        q.id,
        q.timestamp,
        d.domain,
        c.ip AS clientIp,
        c.mac AS clientMac,
        q.type AS queryType,
        CASE
          WHEN q.status IN (1, 4) THEN 'blocked'
          WHEN q.status = 2 THEN 'cached'
          ELSE 'allowed'
        END AS status
      FROM queries q
      JOIN domains d ON q.domain_id = d.id
      JOIN clients c ON q.client_id = c.id
      WHERE q.id > ?
      ORDER BY q.id ASC
      LIMIT 5000
    `
      )
      .bind(sinceId)
      .all() as DnsLogEntry[]

    return rows
  } catch (error) {
    console.error('Failed to read FTL database:', error)
    return []
  }
}

// Get the max query ID (for initial cursor)
export function getMaxId(): number {
  const db = getDb()

  try {
    const row = db.prepare('SELECT MAX(id) as maxId FROM queries').get() as {
      maxId: number | null
    }
    return row.maxId ?? 0
  } catch {
    return 0
  }
}
