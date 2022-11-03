import config from "config";
import toolbelt from "ts-toolbelt";
import { AppConfig } from "./config/types.ts";
import { DottedPaths } from "./types/dotted-paths.ts";

declare module "config" {
  interface IConfig {
    getTyped: <
      Path extends DottedPaths<AppConfig>,
    >(
      path: toolbelt.Function.Narrow<Path>,
    ) => toolbelt.Object.Path<AppConfig, toolbelt.String.Split<Path, ".">>;
  }
}

const prototype: config.IConfig = Object.getPrototypeOf(config);
// It's still the same `config.get`. The real trick here was with augmenting the type definition for `config`.
prototype.getTyped = config.get as unknown as typeof prototype.getTyped;

export { config };
