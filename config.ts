import config from "config";
import { Function, Object, String } from "ts-toolbelt";

export type AppConfig = {
  upstash: {
    redisRestUrl: string;
    redisRestToken: string;
  };
};

declare module "config" {
  interface IConfig {
    getTyped: <
      Path extends DotNestedKeys<AppConfig>,
    >(
      path: Function.Narrow<Path>,
    ) => Object.Path<AppConfig, String.Split<Path, ".">>;
  }
}

config.getTyped("upstash.redisRestUrl");

// ==============================

type User = {
  name: string;
  age: number;
  friends: User[];
};

declare const user: User;

declare const appConfig: AppConfig;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends Record<string, unknown> ? {
    [K in Exclude<keyof T, symbol>]:
      | `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
      | K;
  }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;

declare const getTyped: <
  Obj extends Record<string, unknown>,
  Path extends DotNestedKeys<Obj>,
>(
  obj: Function.Narrow<Obj>,
  path: Function.Narrow<Path>,
) => Object.Path<typeof obj, String.Split<Path, ".">>;

getTyped(appConfig, "upstash");
