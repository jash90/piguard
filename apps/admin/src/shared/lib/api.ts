/**
 * Convex API references using anyApi so this compiles before `convex dev`
 * generates the typed API. Once generated, replace with:
 *   import { api } from 'convex/_generated/api'
 */
import { anyApi } from 'convex/server'

export const api = anyApi as {
  devices: {
    list: typeof anyApi.devices.list
    assignToChild: typeof anyApi.devices.assignToChild
  }
  children: {
    list: typeof anyApi.children.list
    create: typeof anyApi.children.create
    update: typeof anyApi.children.update
    remove: typeof anyApi.children.remove
  }
  blockRules: {
    list: typeof anyApi.blockRules.list
    create: typeof anyApi.blockRules.create
    update: typeof anyApi.blockRules.update
    remove: typeof anyApi.blockRules.remove
    setSocialMediaActive: typeof anyApi.blockRules.setSocialMediaActive
  }
  socialPlatforms: {
    list: typeof anyApi.socialPlatforms.list
    addCustom: typeof anyApi.socialPlatforms.addCustom
    seedPredefined: typeof anyApi.socialPlatforms.seedPredefined
  }
  schedules: {
    getByChild: typeof anyApi.schedules.getByChild
    create: typeof anyApi.schedules.create
    update: typeof anyApi.schedules.update
    remove: typeof anyApi.schedules.remove
  }
}
