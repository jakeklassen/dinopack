import { factoredInteger } from "./factored-integer.ts";
import { Item, Position, RotationType } from "./item.ts";

export class Bin {
  #name = "";
  #width = 0;
  #height = 0;
  #depth = 0;
  #maxWeight = 0;

  #items: Item[] = [];

  constructor(
    name: string,
    width: number,
    height: number,
    depth: number,
    maxWeight: number,
  ) {
    this.#name = name;
    this.#width = factoredInteger(width);
    this.#height = factoredInteger(height);
    this.#depth = factoredInteger(depth);
    this.#maxWeight = factoredInteger(maxWeight);
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

  public get maxWeight() {
    return this.#maxWeight;
  }

  public get items() {
    return this.#items;
  }

  public set items(items: Item[]) {
    this.#items = items;
  }

  public get volume() {
    return this.#width * this.#height * this.#depth;
  }

  public get packedWeight() {
    return this.#items.reduce((weight, item) => weight + item.weight, 0);
  }

  public weighItem(item: Item) {
    return !this.maxWeight || item.weight + this.packedWeight <= this.maxWeight;
  }

  /**
   * Calculate a score for a given item and rotation type.
   *
   * Scores are higher for rotations that closest match item dimensions to Bin dimensions.
   * For example, rotating the item so the longest side is aligned with the longest Bin side.
   *
   * Example (Bin is 11 x 8.5 x 5.5, Item is 8.1 x 5.2 x 5.2):
   *  Rotation 0:
   *    8.1 / 11  = 0.736
   *    5.2 / 8.5 = 0.612
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.736 ** 2 + 0.612 ** 2 + 0.945 ** 2 = 1.809
   *
   *  Rotation 1:
   *    8.1 / 8.5 = 0.953
   *    5.2 / 11 = 0.473
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.953 ** 2 + 0.473 ** 2 + 0.945 ** 2 = 2.025
   */
  public scoreRotation(item: Item, rotationType: RotationType) {
    item.rotationType = rotationType;
    const { dimension } = item;

    // If item doesn't fit in bin, return 0
    if (
      this.width < dimension[0] ||
      this.height < dimension[1] ||
      this.depth < dimension[2]
    ) {
      return 0;
    }

    // Square the results to increase the impact of high values (e.g.  0.8)
    const widthScore = Math.pow(dimension[0] / this.width, 2);
    const heightScore = Math.pow(dimension[1] / this.height, 2);
    const depthScore = Math.pow(dimension[2] / this.depth, 2);

    return widthScore + heightScore + depthScore;
  }

  /**
   * Calculate the best rotation order for a given Item based on
   * scoreRotation().
   *
   * @return Rotation types sorted by their score, DESC
   */
  public getBestRotationOrder(item: Item): RotationType[] {
    const rotationScores: Record<string, number> = {};

    // Score all the rotation types
    for (let i = 0; i < item.allowedRotation.length; ++i) {
      const rotation = item.allowedRotation[i];
      rotationScores[rotation] = this.scoreRotation(item, rotation);
    }

    // Sort the rotation types (index of scores object) DESC
    // and ensure integer values are returned
    const sortedRotations = Object.keys(rotationScores)
      .sort((a, b) => {
        return rotationScores[b] - rotationScores[a];
      })
      .map((rotation) => parseInt(rotation, 10));

    return sortedRotations as RotationType[];
  }

  public putItem(item: Item, position: Position) {
    let fit = false;
    const rotation = this.getBestRotationOrder(item);
    item.position = position;

    for (let i = 0; i < rotation.length; ++i) {
      item.rotationType = rotation[i];
      const dimension = item.dimension;

      if (
        this.width < position[0] + dimension[0] ||
        this.height < position[1] + dimension[1] ||
        this.depth < position[2] + dimension[2]
      ) {
        fit = false;
      } else {
        fit = true;

        for (let j = 0; j < this.items.length; ++j) {
          const nextItem = this.items[j];

          if (nextItem.intersect(item)) {
            fit = false;
            break;
          }
        }

        if (fit) {
          this.items.push(item);
        }
      }

      if (fit) {
        break;
      }
    }

    return fit;
  }

  public toString() {
    const dimension = [this.width, this.height, this.depth].join("x");

    return `Bin:${this.name} (WxHxD = ${dimension}, MaxWg. = ${this.maxWeight})`;
  }
}
