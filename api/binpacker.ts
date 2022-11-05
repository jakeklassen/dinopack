import "std/dotenv/load.ts";
import { serve } from "std/http/server.ts";
import { z } from "zod";
import { config } from "../config.ts";
import { PrismaClient } from "../generated/client/deno/edge.ts";
import { Bin } from "../lib/3d/bin.ts";
import { Item } from "../lib/3d/item.ts";
import { Packer } from "../lib/3d/packer.ts";
import { IpInfoResponse } from "../types/ipinfo.ts";

const prisma = new PrismaClient();

const packSchema = z.object({
  bins: z.array(
    z.object({
      name: z.string(),
      width: z.number(),
      height: z.number(),
      depth: z.number(),
      maxWeight: z.number(),
    }),
  ).nonempty().transform((bins) =>
    bins.map((bin) =>
      new Bin(bin.name, bin.width, bin.height, bin.depth, bin.maxWeight)
    )
  ),
  items: z.array(
    z.object({
      name: z.string(),
      width: z.number(),
      height: z.number(),
      depth: z.number(),
      weight: z.number(),
    }),
  ).nonempty().transform((items) =>
    items.map((item) =>
      new Item(item.name, item.width, item.height, item.depth, item.weight)
    )
  ),
});

serve(async (request, connInfo) => {
  const { ip } = await fetch("https://ipinfo.io", {
    headers: {
      authorization: `Bearer ${config.getTyped("ipinfoToken")}`,
    },
  }).then((res) => res.json() as Promise<IpInfoResponse>);

  if (request.method === "GET" && request.url.endsWith("/health")) {
    return new Response("OK");
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  await prisma.ip.upsert({
    where: { ip },
    update: {
      requests: {
        increment: 1,
      },
    },
    create: { ip },
  });

  const payload = await request.json();

  try {
    const { bins, items } = packSchema.parse(payload);

    const packer = new Packer(
      bins,
      items,
    );

    const bin = packer.pack();

    return new Response(JSON.stringify(bin), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
});
