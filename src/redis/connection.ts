import { createClient } from "redis";

let redisClient = createClient();

const initializeRedis = async () => {
  try {
    redisClient.on("error", (err) => {
      console.log("Error event occured in redis", err);
    });
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.log("Failed to connect redis", error);
    throw error;
    
  }
};

export { initializeRedis, redisClient };
