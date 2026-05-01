import { Redis } from '@upstash/redis'

let redis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
} else {
  console.warn("Upstash Redis environment variables are missing. Caching will be disabled.");
  // Mock redis object to avoid crashes
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
  }
}

export default redis
