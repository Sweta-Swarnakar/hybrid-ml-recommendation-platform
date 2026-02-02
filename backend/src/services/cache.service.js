const redis = require("redis");
const inMemoryCache = {};

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
};
