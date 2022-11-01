import { serve } from "https://deno.land/std@0.161.0/http/server.ts";
import { Bin } from "../lib/3d/bin.ts";
import { Item } from "../lib/3d/item.ts";
import { Packer } from "../lib/3d/packer.ts";

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
