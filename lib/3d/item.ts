import { factoredInteger } from "./factored-integer.ts";

export const RotationType_WHD = 0;
export const RotationType_HWD = 1;
export const RotationType_HDW = 2;
export const RotationType_DHW = 3;
export const RotationType_DWH = 4;
export const RotationType_WDH = 5;

export const WidthAxis = 0;
export const HeightAxis = 1;
export const DepthAxis = 2;

export const StartPosition: Position = [0, 0, 0];

export const RotationTypeStrings = {
  [RotationType_WHD]: "RotationType_WHD (w,h,d)",
  [RotationType_HWD]: "RotationType_HWD (h,w,d)",
  [RotationType_HDW]: "RotationType_HDW (h,d,w)",
  [RotationType_DHW]: "RotationType_DHW (d,h,w)",
  [RotationType_DWH]: "RotationType_DWH (d,w,h)",
  [RotationType_WDH]: "RotationType_WDH (w,d,h)",
};

export type RotationType =
  | typeof RotationType_WHD
  | typeof RotationType_HWD
  | typeof RotationType_HDW
  | typeof RotationType_DHW
  | typeof RotationType_DWH
  | typeof RotationType_WDH;

export type Dimension = [number, number, number];

/**
 * x, y, z
 */
export type Position = [number, number, number];

export class Item {
  #name = "";
  #width = 0;
  #height = 0;
  #depth = 0;
  #weight = 0;
  #allowedRotation: Array<RotationType> = [0, 1, 2, 3, 4, 5];

  #rotationType: RotationType = RotationType_WHD;

  #position: Position | [] = [];

  constructor(
    name = "",
    width = 0,
    height = 0,
    depth = 0,
    weight = 0,
    allowedRotation?: RotationType[],
  ) {
    this.#name = name;
    this.#width = factoredInteger(width);
    this.#height = factoredInteger(height);
    this.#depth = factoredInteger(depth);
    this.#weight = factoredInteger(weight);
    this.#allowedRotation = allowedRotation
      ? allowedRotation
      : this.#allowedRotation;
  }

  public get name() {
    return this.#name;
  }

  public get width() {
    return this.#width;
  }

  public get height() {
    return this.#height;
  }

  public get depth() {
    return this.#depth;
  }

  public get weight() {
    return this.#weight;
  }

  public get allowedRotation() {
    return this.#allowedRotation;
  }

  public get rotationType() {
    return this.#rotationType;
  }

  public set rotationType(rotationType: RotationType) {
    this.#rotationType = rotationType;
  }

  public get rotationTypeString() {
    return RotationTypeStrings[this.#rotationType];
  }

  public get dimension() {
    let dimension: Dimension;

    switch (this.#rotationType) {
      case RotationType_WHD:
        dimension = [this.width, this.height, this.depth];
        break;
      case RotationType_HWD:
        dimension = [this.height, this.width, this.depth];
        break;
      case RotationType_HDW:
        dimension = [this.height, this.depth, this.width];
        break;
      case RotationType_DHW:
        dimension = [this.depth, this.height, this.width];
        break;
      case RotationType_DWH:
        dimension = [this.depth, this.width, this.height];
        break;
      case RotationType_WDH:
        dimension = [this.width, this.depth, this.height];
        break;
    }

    return dimension;
  }

  public get position() {
    return this.#position;
  }

  public set position(position: Position | []) {
    this.#position = position;
  }

  public intersect(item: Item) {
    return (
      rectIntersect(this, item, WidthAxis, HeightAxis) &&
      rectIntersect(this, item, HeightAxis, DepthAxis) &&
      rectIntersect(this, item, WidthAxis, DepthAxis)
    );
  }

  public get volume() {
    return this.#width * this.#height * this.#depth;
  }

  public toString() {
    const name = `Item:${this.#name}`;
    const dimension = this.dimension.join("x");

    return `${name} (${this.rotationType} = ${dimension}, Wg. = $this.#weight)`;
  }

  public toJSON() {
    return {
      name: this.#name,
      width: this.#width,
      height: this.#height,
      depth: this.#depth,
      weight: this.#weight,
      allowedRotation: this.#allowedRotation,
      rotationType: this.#rotationType,
      position: this.#position,
    };
  }
}

export const rectIntersect = (
  item1: Item,
  item2: Item,
  x: number,
  y: number,
) => {
  const d1 = item1.dimension;
  const d2 = item2.dimension;

  const cx1 = item1.position[x] + d1[x] / 2;
  const cy1 = item1.position[y] + d1[y] / 2;
  const cx2 = item2.position[x] + d2[x] / 2;
  const cy2 = item2.position[y] + d2[y] / 2;

  const ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  const iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
};
