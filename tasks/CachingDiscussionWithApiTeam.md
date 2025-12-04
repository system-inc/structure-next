# Caching Discussion: Frontend SSR Performance and API-Level Solutions

## Overview

This document captures a comprehensive exploration of caching strategies for improving SSR performance on Phi Health, specifically for support pages. After extensive analysis of frontend caching options (OpenNext with Cloudflare R2/KV), we concluded that **API-level caching is the correct architectural solution**.

This document is intended to facilitate discussion with the API team (Kam) about implementing GraphQL response caching.

## The Problem

### Current Performance Issues

Support pages (`/support` and `/support/[...supportPath]`) are slow due to SSR GraphQL queries:

1. **`/support` (main page)**: Single query fetching 11 post topics by ID
2. **`/support/[...supportPath]` (dynamic pages)**: N+1 query pattern

### The N+1 Query Problem

When rendering a support topic page with sub-topics:

```
Request: /support/getting-started

Query 1: PostTopic(slug: "getting-started")     → ~100ms
         Returns: { topic, pagedPosts, subTopics: [5 items] }

Query 2: PostTopic(slug: "sub-topic-1")         → ~100ms  ┐
Query 3: PostTopic(slug: "sub-topic-2")         → ~100ms  │
Query 4: PostTopic(slug: "sub-topic-3")         → ~100ms  ├─ Promise.all (parallel)
Query 5: PostTopic(slug: "sub-topic-4")         → ~100ms  │
Query 6: PostTopic(slug: "sub-topic-5")         → ~100ms  ┘

Total: ~200ms best case (parallel) to ~600ms worst case (serial)
```

The frontend must make N+1 round trips because `PostTopic.subTopics` only returns slugs, not the nested `pagedPosts` for each sub-topic.

### Current Code

**`/support/page.tsx`**:

```typescript
async function getServerSideProperties() {
    const serverSideNetworkService = await getServerSideNetworkService();

    // Single query, but API must resolve 11 topics
    const postTopicsRequest = await serverSideNetworkService.graphQlRequest(
        PostTopicsDocument,
        {
            ids: [
                '989becc3-d0e5-4df3-ae8d-b25401a0729b',
                'b58b1475-e267-4623-9728-c91dd708486a',
                // ... 9 more UUIDs
            ],
        },
    );

    return { postTopicsData: postTopicsRequest };
}
```

**`/support/[...supportPath]/page.tsx`**:

```typescript
async function getServerSideProperties(supportPath: string[]) {
    // First query: get the topic
    const postTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
        slug: postTopicSlug,
        type: 'SupportArticle',
        pagination: { itemsPerPage: 100 },
    });

    // N more queries: get posts for each sub-topic
    if (postTopicData?.postTopic?.subTopics?.length) {
        const subPostTopics = await Promise.all(
            postTopicData.postTopic.subTopics.map(async function (subTopic) {
                return serverSideNetworkService.graphQlRequest(PostTopicDocument, {
                    slug: subTopic.slug,
                    type: 'SupportArticle',
                    pagination: { itemsPerPage: 100 },
                });
            }),
        );
    }
}
```

---

## Frontend Caching Options Explored

We thoroughly investigated frontend caching with OpenNext on Cloudflare. Here's what we found:

### Option 1: Cloudflare KV Cache

**Configuration** (already partially set up in `wrangler.toml`):

```toml
[[kv_namespaces]]
binding = "NEXT_CACHE_WORKERS_KV"
id = "312165a39fc7405aa25b36d9ea8628bc"
```

**Pros**:

-   Fast reads (~10-50ms) via Cloudflare's Tiered Cache
-   Simple setup (already have the namespace)
-   Reads from nearest edge location

**Cons**:

-   **Eventually consistent** (up to 60 seconds for global propagation)
-   OpenNext officially does **not recommend** KV for this reason
-   After cache invalidation, some users may still see stale content
-   Stale data could persist indefinitely in edge cases

### Option 2: Cloudflare R2 Cache (Recommended by OpenNext)

**Configuration**:

```toml
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "www-phi-health-cache"

[[services]]
binding = "WORKER_SELF_REFERENCE"
service = "www-phi-health"
```

**Pros**:

-   Strongly consistent
-   Properly respects revalidation
-   Cost-effective storage ($0.015/GB-month)

**Cons**:

-   Slightly higher read latency than KV (~50-150ms)
-   **Cache keys include build ID** (critical issue - see below)
-   Requires D1 database for tag-based invalidation

### The Build ID Problem

This is the **critical issue** that makes frontend page caching impractical for our use case.

OpenNext's R2 cache keys include the Next.js build ID:

```javascript
// From @opennextjs/cloudflare r2-incremental-cache.js
getR2Key(key, cacheType) {
    return computeCacheKey(key, {
        prefix: 'incremental-cache',
        buildId: process.env.NEXT_BUILD_ID,  // <-- Build ID included
        cacheType,
    });
}

// Results in keys like:
// incremental-cache/{buildId}/{sha256-hash}.cache
```

**Impact**: Every deploy generates a new build ID, which means:

-   All cached pages become orphaned on each deploy
-   Cache is completely cold after every deployment
-   Since we deploy frequently, caching provides minimal benefit
-   Old cache entries accumulate in R2 (though R2 lifecycle rules can clean these up)

### Cache Invalidation Complexity

Even if we solved the build ID problem, cache invalidation remains complex:

**What gets cached**: The entire rendered HTML page, not individual GraphQL responses.

**Invalidation flow**:

```
Post edited in CMS
       │
       ▼
Frontend doesn't know about this
       │
       ▼
Options:
  A) TTL-based: Wait for cache to expire (up to N hours of stale content)
  B) Webhook: Backend calls frontend /api/revalidate endpoint
  C) Manual: Developer remembers to purge cache
```

**For webhook-based invalidation**, we'd need:

1. API route on frontend to receive invalidation requests
2. Backend to call this endpoint on post create/update/delete
3. Secret management for authentication
4. Path construction logic (or tag-based invalidation with D1)

**We already have client-side cache invalidation** in our mutation hooks:

```typescript
// usePostUpdateRequest.ts
invalidateOnSuccess: function (variables) {
    return [[postsCacheKey], ['post', variables.id]];
}
```

But this only invalidates TanStack Query (client-side). Server-side R2 cache is completely separate.

### Tag-Based vs Path-Based Invalidation

**Path-based** (simpler, no D1 needed):

```typescript
revalidatePath('/support/billing/articles/abc123/how-to-pay');
```

-   Must know exact URLs
-   Works for our use case since URL structure is predictable

**Tag-based** (requires D1 database):

```typescript
revalidateTag('support');  // Invalidates all pages tagged 'support'
```

-   More flexible for bulk invalidation
-   Requires D1 for storing tag → timestamp mappings
-   Adds a D1 read on every cache hit (lazy validation)

### R2 Lifecycle and Cleanup

R2 doesn't have automatic TTL on objects. Cleanup options:

1. **R2 Lifecycle Rules**: Auto-delete objects older than N days (recommended)
2. **Manual cleanup**: `npx wrangler r2 object delete --recursive`
3. **Redeploy**: Old build ID entries become orphaned

---

## Why API-Level Caching is the Right Solution

After exploring all frontend options, we concluded that **caching belongs at the API layer**, not the frontend.

### Separation of Concerns

```
Current (Frontend Caching - Problematic):

Request → Worker → R2 Cache? → SSR + GraphQL → Response
                      │
                      └── Tied to build ID
                      └── Cold on every deploy
                      └── Complex cross-service invalidation
                      └── Two caches to manage (client + server)

Better (API Caching):

Request → Worker → SSR → GraphQL API → Cached Response
                              │
                              └── Cache lives in API layer
                              └── Build-agnostic
                              └── API knows when data changes
                              └── Single source of truth
```

### Why API Caching Makes Sense

1. **The API owns the data**: It knows when posts are created/updated/deleted. No webhooks needed.

2. **Cache invalidation is local**: When a post changes, the API invalidates immediately. No cross-service coordination.

3. **Build-agnostic**: Deploy frontend 100 times, cache stays warm.

4. **Single source of truth**: One caching layer instead of two (no client TanStack + server R2 to manage).

5. **Benefits all consumers**: Mobile app, other frontends, internal tools all benefit from the same cache.

6. **Simpler frontend code**: No `revalidate` exports, no R2/D1 configuration, no build ID concerns.

---

## Proposed API Changes

### Request 1: GraphQL Response Caching

**What we need**: Cache GraphQL query responses at the API layer.

**Suggested implementation**:

```
GraphQL Request: PostTopicsDocument(ids: [...])

API Layer:
1. Hash query + variables → cache key
2. Check cache (Redis, Cloudflare KV, or similar)
3. Hit → return cached response
4. Miss → query DB → cache response → return

On Post/Topic Mutation:
1. Save to DB
2. Invalidate relevant cache keys
3. Done (no external webhooks)
```

**Cache key strategy options**:

-   Hash of query document + variables
-   Entity-based keys (e.g., `post:{id}`, `postTopic:{slug}`)

**TTL considerations**:

-   Support content changes infrequently
-   Long TTL (hours/days) with on-demand invalidation is ideal
-   Or no TTL with explicit invalidation on mutations

### Request 2: Nested Sub-Topic Posts in PostTopic Query

**Current behavior**:

```graphql
query PostTopic($slug: String!) {
    postTopic(slug: $slug) {
        topic { title, slug }
        pagedPosts { items { ... } }
        subTopics {
            slug
            title
            # No pagedPosts here - requires separate query
        }
    }
}
```

**Requested behavior**:

```graphql
query PostTopicWithSubTopicPosts($slug: String!) {
    postTopic(slug: $slug) {
        topic { title, slug }
        pagedPosts { items { ... } }
        subTopics {
            slug
            title
            pagedPosts { items { ... } }  # Include posts inline
        }
    }
}
```

**Benefits**:

-   Reduces N+1 queries to single query
-   API can optimize with single DB query or efficient batching
-   Frontend code becomes simpler
-   Even without caching, this significantly improves performance

---

## Performance Impact Estimates

### Current State (No Caching)

| Page                               | Queries     | Estimated Time |
| ---------------------------------- | ----------- | -------------- |
| `/support`                         | 1 (11 IDs)  | ~150-300ms     |
| `/support/{topic}` (no sub-topics) | 1           | ~100-150ms     |
| `/support/{topic}` (5 sub-topics)  | 6 (1 + 5)   | ~200-400ms     |
| `/support/{topic}` (10 sub-topics) | 11 (1 + 10) | ~300-600ms     |

### With API Caching + Nested Query

| Page               | Queries | Cache Hit | Cache Miss |
| ------------------ | ------- | --------- | ---------- |
| `/support`         | 1       | ~20-50ms  | ~150-300ms |
| `/support/{topic}` | 1       | ~20-50ms  | ~100-200ms |

**Expected improvement**: 3-10x faster on cache hits.

---

## Frontend Changes (Minimal)

Once API caching is implemented, frontend changes are minimal:

### Remove N+1 Pattern

**Before**:

```typescript
const postTopicData = await serverSideNetworkService.graphQlRequest(PostTopicDocument, {
    slug: postTopicSlug,
});

if (postTopicData?.postTopic?.subTopics?.length) {
    const subPostTopics = await Promise.all(
        postTopicData.postTopic.subTopics.map(async function (subTopic) {
            return serverSideNetworkService.graphQlRequest(PostTopicDocument, {
                slug: subTopic.slug,
            });
        }),
    );
}
```

**After** (with nested query):

```typescript
const postTopicData = await serverSideNetworkService.graphQlRequest(
    PostTopicWithSubTopicsDocument,  // New query with nested pagedPosts
    { slug: postTopicSlug },
);
// All data in one response, no additional queries needed
```

### No Frontend Cache Configuration Needed

-   No R2/KV setup in `wrangler.toml`
-   No changes to `OpenNextConfiguration.ts`
-   No `export const revalidate` on pages
-   No `/api/revalidate` endpoint
-   No D1 tag cache

---

## Alternative: Hybrid Approach

If API caching is not immediately feasible, a hybrid approach could work:

### Short-Term: TTL-Based Frontend Caching

```typescript
// app/(main-layout)/support/page.tsx
export const revalidate = 3600;  // 1 hour TTL

// app/(main-layout)/support/[...supportPath]/page.tsx
export const revalidate = 3600;  // 1 hour TTL
```

**Trade-offs**:

-   Up to 1 hour of stale content after edits
-   Cache is cold after each deploy (build ID issue)
-   Still requires R2 setup

### Medium-Term: Add Nested Query

Even without API caching, adding `pagedPosts` to `subTopics` eliminates N+1 and improves performance significantly.

### Long-Term: Full API Caching

Complete solution with response caching and on-mutation invalidation.

---

## Questions for API Team

1. **Caching infrastructure**: What caching layer is currently available or planned? (Redis, Cloudflare KV, in-memory, etc.)

2. **Cache invalidation strategy**: How would cache invalidation work on post/topic mutations? Entity-based keys vs query-based keys?

3. **Nested query feasibility**: Can `PostTopic.subTopics` include `pagedPosts` without significant performance impact? Is this a schema change or resolver change?

4. **Timeline**: What's a realistic timeline for implementing:

    - GraphQL response caching (high impact)
    - Nested sub-topic posts (medium impact, simpler change)

5. **Batch query support**: Is there an existing or planned way to batch multiple queries in a single request? (e.g., DataLoader pattern)

---

## Summary

| Approach          | Complexity | Cache Persistence     | Invalidation             | Recommended |
| ----------------- | ---------- | --------------------- | ------------------------ | ----------- |
| Frontend KV       | Low        | Eventually consistent | Complex (webhooks)       | No          |
| Frontend R2       | Medium     | Strong, but per-build | Complex (webhooks)       | No          |
| Frontend TTL-only | Low        | Per-build             | Automatic (stale window) | Temporary   |
| **API Caching**   | Medium     | Build-agnostic        | Simple (local)           | **Yes**     |

**Conclusion**: API-level caching is the architecturally correct solution. It eliminates the build ID problem, simplifies invalidation, benefits all consumers, and keeps the frontend stateless.

**Immediate win**: Adding `pagedPosts` to `subTopics` in the GraphQL schema eliminates N+1 queries regardless of caching strategy.

---

## Appendix: OpenNext/Cloudflare Configuration Reference

For reference, here's what frontend caching would require if we pursued it:

### R2 + D1 Full Setup

**wrangler.toml**:

```toml
# R2 bucket for incremental cache
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "www-phi-health-cache"

# Self-reference for background revalidation
[[services]]
binding = "WORKER_SELF_REFERENCE"
service = "www-phi-health"

# D1 for tag cache (required for revalidateTag)
[[d1_databases]]
binding = "NEXT_TAG_CACHE_D1"
database_name = "www-phi-health-tag-cache"
database_id = "<generated-after-create>"
```

**OpenNextConfiguration.ts**:

```typescript
export const OpenNextConfiguration: OpenNextConfig = {
    default: {
        override: {
            wrapper: 'cloudflare-node',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
            incrementalCache: 'r2',      // Changed from 'dummy'
            tagCache: 'd1',              // Changed from 'dummy'
            queue: 'direct',             // Changed from 'dummy'
        },
    },
    // ...
};
```

**Revalidation API route**:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const { secret, path } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (path) {
        revalidatePath(path);
        return Response.json({ revalidated: path });
    }

    return Response.json({ error: 'No path provided' }, { status: 400 });
}
```

This configuration is documented here for completeness but is **not recommended** given the build ID limitations and complexity of cross-service invalidation.

---

## Resources

-   [OpenNext Cloudflare Caching Documentation](https://opennext.js.org/cloudflare/caching)
-   [OpenNext 0.5 KV Cache Setup](https://opennext.js.org/cloudflare/former-releases/0.5/caching)
-   [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
-   [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
-   [GitHub Discussion: Caching Strategy for Large Next.js Sites](https://github.com/vercel/next.js/discussions/84120)
