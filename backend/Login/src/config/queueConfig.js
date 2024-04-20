export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

// import Redis from "ioredis"

// export const redisConnection = new Redis(process.env.REDIS_HOSTI);

// export default redisConnection;

export const defaultQueueConfig = {
  removeOnComplete: {
    count: 100,
    age: 60 * 60 * 24,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};
