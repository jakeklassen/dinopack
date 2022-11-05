import { ConnInfo } from "std/http/server.ts";
import { assertIsNetAddr } from "./assert-is-net-address.ts";

export function getRemoteAddress(connInfo: ConnInfo): Deno.NetAddr {
  assertIsNetAddr(connInfo.remoteAddr);

  return connInfo.remoteAddr;
}
