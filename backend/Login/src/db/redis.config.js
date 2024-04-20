import redis from "express-redis-cache";

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPrefix = process.env.REDIS_PREFIX || 'master_backend';
const redisExpire = process.env.REDIS_EXPIRE || (60 * 60); 

const redisCache = redis({
  port: redisHost,
  host: redisPort,
  prefix: redisPrefix,
  expire: redisExpire,
});

export default redisCache;

// import Redis from "ioredis"

// const redisCache = new Redis(process.env.REDIS_HOST);

// export default redisCache;