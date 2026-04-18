/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as blockRules from "../blockRules.js";
import type * as children from "../children.js";
import type * as crons from "../crons.js";
import type * as devices from "../devices.js";
import type * as dnsLogs from "../dnsLogs.js";
import type * as http from "../http.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_categories from "../lib/categories.js";
import type * as lib_push from "../lib/push.js";
import type * as notifications from "../notifications.js";
import type * as push_tokens from "../push_tokens.js";
import type * as schedules from "../schedules.js";
import type * as schedulesCron from "../schedulesCron.js";
import type * as social_platforms from "../social_platforms.js";
import type * as tips from "../tips.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blockRules: typeof blockRules;
  children: typeof children;
  crons: typeof crons;
  devices: typeof devices;
  dnsLogs: typeof dnsLogs;
  http: typeof http;
  "lib/ai": typeof lib_ai;
  "lib/categories": typeof lib_categories;
  "lib/push": typeof lib_push;
  notifications: typeof notifications;
  push_tokens: typeof push_tokens;
  schedules: typeof schedules;
  schedulesCron: typeof schedulesCron;
  social_platforms: typeof social_platforms;
  tips: typeof tips;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
