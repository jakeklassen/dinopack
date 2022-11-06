import "std/dotenv/load.ts";
import { Bin } from "lib/3d/bin.ts";
import { Item } from "lib/3d/item.ts";
import { Packer } from "lib/3d/packer.ts";
import { getRemoteAddress } from "lib/utils/get-remote-address.ts";
import { serve } from "std/http/server.ts";
import { z } from "zod";
import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";
// import { PrismaClient } from "../generated/client/deno/edge.ts";
// import { IpInfoResponse } from "../types/ipinfo.ts";

const databaseUrl = Deno.env.get("DATABASE_URL")!;
const pool = new postgres.Pool(databaseUrl, 3, true);

// const prisma = new PrismaClient();

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
  // const { ip } = await fetch("https://ipinfo.io", {
  //   headers: {
  //     authorization: `Bearer ${Deno.env.get("IPINFO_TOKEN")}`,
  //   },
  // }).then((res) => res.json() as Promise<IpInfoResponse>);

  const { hostname } = getRemoteAddress(connInfo);

  if (request.method === "GET") {
    if (request.url.endsWith("/health")) {
      return new Response("OK");
    }

    if (request.url.includes("loaderio-d4bbbe4b1594a62dae3a00dbee1ee64b.txt")) {
      return new Response("loaderio-d4bbbe4b1594a62dae3a00dbee1ee64b");
    }
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Grab a connection from the database pool
  const connection = await pool.connect();

  try {
    await connection.queryArray(
      `
      INSERT INTO "Ip" (id, ip, requests, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (ip)
        DO UPDATE SET requests = "Ip".requests + 1
        WHERE "Ip".ip = EXCLUDED.ip
    `,
      [hostname],
    );
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }

  // await prisma.ip.upsert({
  //   where: { ip: hostname },
  //   update: {
  //     requests: {
  //       increment: 1,
  //     },
  //   },
  //   create: { ip: hostname },
  // });

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
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
});
