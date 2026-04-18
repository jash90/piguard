import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Devices on the home network
  devices: defineTable({
    macAddress: v.string(),
    ipAddress: v.string(),
    hostname: v.optional(v.string()),
    childProfileId: v.optional(v.id('children_profiles')),
    firstSeen: v.number(),
    lastSeen: v.number(),
    isOnline: v.boolean(),
  })
    .index('by_child', ['childProfileId'])
    .index('by_mac', ['macAddress']),

  // Child profiles created by parents
  children_profiles: defineTable({
    name: v.string(),
    avatarColor: v.string(),
    parentId: v.string(),
    defaultBlockCategories: v.optional(v.array(v.string())),
  }),

  // DNS query log entries (high-volume)
  dns_logs: defineTable({
    deviceId: v.id('devices'),
    domain: v.string(),
    clientIp: v.string(),
    queryType: v.string(),
    status: v.string(), // 'blocked' | 'allowed' | 'cached'
    category: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index('by_device', ['deviceId'])
    .index('by_timestamp', ['timestamp'])
    .index('by_device_timestamp', ['deviceId', 'timestamp'])
    .index('by_status_timestamp', ['status', 'timestamp']),

  // Blocking rules (managed from admin panel)
  block_rules: defineTable({
    childProfileId: v.optional(v.id('children_profiles')),
    type: v.string(), // 'domain' | 'social_media' | 'category'
    value: v.string(),
    label: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index('by_child', ['childProfileId'])
    .index('by_type', ['type'])
    .index('by_type_value', ['type', 'value'])
    .index('by_active', ['isActive']),

  // Time-based access schedules
  schedules: defineTable({
    childProfileId: v.id('children_profiles'),
    daysOfWeek: v.array(v.number()), // 0-6
    startTime: v.string(), // '22:00'
    endTime: v.string(), // '06:00'
    action: v.string(), // 'block_all' | 'block_categories'
    categories: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  }).index('by_child', ['childProfileId']),

  // Social media platforms (predefined + custom)
  social_platforms: defineTable({
    name: v.string(),
    domains: v.array(v.string()),
    iconUrl: v.optional(v.string()),
    isPredefined: v.boolean(),
  }),

  // Push notification tokens
  push_tokens: defineTable({
    userId: v.string(),
    token: v.string(),
    platform: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  // Sync cursor — tracks last Pi-hole log offset
  sync_state: defineTable({
    key: v.string(),
    value: v.string(),
  }).index('by_key', ['key']),

  // Cached AI-generated conversation tips
  cached_tips: defineTable({
    category: v.string(),
    tip: v.string(),
    generatedAt: v.number(),
  }).index('by_category', ['category']),

  // Watched domains — monitored but NOT blocked
  // When a child visits one of these, the parent gets a notification
  watched_domains: defineTable({
    domain: v.string(),
    label: v.optional(v.string()),     // e.g. 'Reddit', 'Discord'
    childProfileId: v.optional(v.id('children_profiles')),  // null = all children
    isActive: v.boolean(),
    notifyParent: v.boolean(),          // always true for watched domains
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index('by_active', ['isActive'])
    .index('by_child', ['childProfileId'])
    .index('by_domain', ['domain']),
})
