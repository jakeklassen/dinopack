import "std/dotenv/load.ts";
import { MultiRegionRatelimit } from "npm:@upstash/ratelimit@0.1.5";
import { Redis } from "npm:@upstash/redis@1.16.0";
import { serve } from "std/http/server.ts";
import { Bin } from "../lib/3d/bin.ts";
import { Item } from "../lib/3d/item.ts";
import { Packer } from "../lib/3d/packer.ts";

const rateLimit = new MultiRegionRatelimit({
  redis: [
    new Redis({
      url: config.get("upstash.redisRestUrl"),
      token: config.get("upstash.redisRestToken"),
    }),
  ],
  limiter: MultiRegionRatelimit.slidingWindow(10, "10 s"),
});

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { bins: binsJSON, items: itemsJSON } = await request.json();

  if (!Array.isArray(binsJSON) || !Array.isArray(itemsJSON)) {
    return new Response("Invalid request body", { status: 400 });
  }

  const bins = binsJSON.map((bin) =>
    new Bin(bin.name, bin.width, bin.height, bin.depth, bin.maxWeight)
  );

  const items = itemsJSON.map((item) =>
    new Item(item.name, item.width, item.height, item.depth, item.weight)
  );

  const packer = new Packer(bins, items);

  const bin = packer.pack();

  return new Response(JSON.stringify(bin), {
    status: 201,
  });
});
