type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type DottedPaths<T> = (T extends Record<string, unknown> ? {
    [K in Exclude<keyof T, symbol>]:
      | `${K}${DotPrefix<DottedPaths<T[K]>>}`
      | K;
  }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;
