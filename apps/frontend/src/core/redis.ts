import Redis from 'ioredis'

const url = process.env.REDIS_URL ?? ''

export const redis = new Redis(url, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => Math.min(times * 200, 2000),
})
