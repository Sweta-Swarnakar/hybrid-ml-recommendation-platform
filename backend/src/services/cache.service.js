const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

let isRedisConnected = false;

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  try {
    await client.connect();
    isRedisConnected = true;
    console.log("✅ Redis connected");
  } catch (err) {
    console.log("❌ Redis failed, fallback to DB");
  }
})();

module.exports = {
  get: async (key) => {
    if (!isRedisConnected) return null;

    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch(err){
        console.warn("Failed to get cache", err);
    }
  },

  set: async (key, value, ttl = 60) => {
    if (!isRedisConnected) return;

    try {
      await client.set(key, JSON.stringify(value), { EX: ttl });
    } catch(err){
        console.warn("Failed to set cache", err);
    }
  },

  delPattern: async (pattern) => {
    if (!isRedisConnected) return;

    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch(err){
        console.warn("Failed to delete cache", err);
      }
  },
};