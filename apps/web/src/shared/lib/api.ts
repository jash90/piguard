import { makeFunctionReference } from 'convex/server'

// ---------------------------------------------------------------------------
// Domain types (derived from packages/backend/convex/schema.ts)
// ---------------------------------------------------------------------------

export interface Device {
  _id: string
  _creationTime: number
  macAddress: string
  ipAddress: string
  hostname?: string
  childProfileId?: string
  firstSeen: number
  lastSeen: number
  isOnline: boolean
}

export interface DnsLog {
  _id: string
  _creationTime: number
  deviceId: string
  domain: string
  clientIp: string
  queryType: string
  /** 'blocked' | 'allowed' | 'cached' */
  status: string
  category?: string
  timestamp: number
}

export interface DnsStats {
  totalQueries: number
  blockedQueries: number
  topDomains: Array<{ domain: string; count: number }>
}

export interface BlockRule {
  _id: string
  _creationTime: number
  childProfileId?: string
  type: string
  value: string
  label?: string
  isActive: boolean
  createdBy: string
  createdAt: number
}

// ---------------------------------------------------------------------------
// Typed function references (used instead of generated api object)
// ---------------------------------------------------------------------------

export const api = {
  devices: {
    list: makeFunctionReference<'query', Record<string, never>, Device[]>(
      'devices:list'
    ),
  },
  dnsLogs: {
    getRecent: makeFunctionReference<'query', { limit?: number }, DnsLog[]>(
      'dnsLogs:getRecent'
    ),
    getByDevice: makeFunctionReference<
      'query',
      { deviceId: string; limit?: number; beforeTimestamp?: number },
      DnsLog[]
    >('dnsLogs:getByDevice'),
    getBlocked: makeFunctionReference<'query', { limit?: number }, DnsLog[]>(
      'dnsLogs:getBlocked'
    ),
    getStats: makeFunctionReference<
      'query',
      Record<string, never>,
      DnsStats
    >('dnsLogs:getStats'),
  },
  blockRules: {
    list: makeFunctionReference<
      'query',
      Record<string, never>,
      BlockRule[]
    >('blockRules:list'),
  },
}
