import { AppConfig } from "../config.ts";

const config: AppConfig = {
  upstash: {
    redisRestUrl: "UPSTASH_REDIS_REST_URL",
    redisRestToken: "UPSTASH_REDIS_REST_TOKEN",
  },
};

export default config;
