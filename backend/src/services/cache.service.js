const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await client.connect();
})();

module.exports = {
  get: async (key) => {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  },

  set: async (key, value, ttl = 60) => {
    await client.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  },

  delPattern: async (pattern) => {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  },
};
