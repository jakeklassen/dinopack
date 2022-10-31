import { Bin } from "./bin.ts";
import {
  DepthAxis,
  HeightAxis,
  Item,
  Position,
  StartPosition,
  WidthAxis,
} from "./item.ts";

export class Packer {
  #bins: Bin[] = [];
  #items: Item[] = [];
  #unfitItems: Item[] = [];

  constructor(bins: Bin[] = [], items: Item[] = []) {
    this.#bins = bins;
    this.#items = items;
  }

  public get bins() {
    return this.#bins;
  }

  public get items() {
    return this.#items;
  }

  public get unfitItems() {
    return this.#unfitItems;
  }

  public get bestFittedBin(): Bin | undefined {
    // If any items didn't fit, we have no bin
    if (this.unfitItems.length > 0) {
      return undefined;
    }

    for (const bin of this.bins) {
      // Get the first bin that has any items
      if (bin.items.length > 0) {
        return bin;
      }
    }

    return undefined;
  }

  addBin(bin: Bin) {
    this.#bins.push(bin);
  }

  addItem(item: Item) {
    this.#items.push(item);
  }

  findFittedBin(item: Item) {
    for (let i = 0; i < this.#bins.length; i++) {
      const bin = this.#bins[i];

      if (!bin.weighItem(item) || !bin.putItem(item, StartPosition)) {
        continue;
      }

      if (bin.items.length === 1 && bin.items[0] === item) {
        bin.items = [];
      }

      return bin;
    }

    return null;
  }

  public getBiggerBinThan(bin: Bin) {
    const volume = bin.volume;

    for (let i = 0; i < this.#bins.length; i++) {
      const potentiallyBiggerBin = this.#bins[i];

      if (potentiallyBiggerBin.volume > volume) {
        return potentiallyBiggerBin;
      }
    }

    return null;
  }

  public unfitItem() {
    if (this.#items.length === 0) {
      return;
    }

    this.#unfitItems.push(this.#items[0]);
    this.#items.splice(0, 1);
  }

  public packToBin(bin: Bin, items: Item[]): Item[] {
    let biggerBin: Bin | null = null;
    const unpackedItems: Item[] = [];
    const fit = bin.weighItem(items[0]) && bin.putItem(items[0], StartPosition);

    if (!fit) {
      biggerBin = this.getBiggerBinThan(bin);

      if (biggerBin != null) {
        return this.packToBin(biggerBin, items);
      }

      return this.items;
    }

    // Pack unpacked items
    for (let i = 1; i < this.items.length; i++) {
      let fitted = false;
      const item = this.items[i];

      if (bin.weighItem(item)) {
        // Try available pivots in current bin that are not intersecting with
        // existing items in current bin.
        lookup:
        for (let pivot = 0; pivot < 3; ++pivot) {
          for (let j = 0; j < bin.items.length; ++j) {
            let position: Position | [] = [];
            const binItem = bin.items[j];
            const dimension = binItem.dimension;

            if (binItem.position.length === 0) {
              throw new Error("Item position is not set");
            }

            switch (pivot) {
              case WidthAxis:
                position = [
                  binItem.position[0] + dimension[0],
                  binItem.position[1],
                  binItem.position[2],
                ];
                break;
              case HeightAxis:
                position = [
                  binItem.position[0],
                  binItem.position[1] + dimension[1],
                  binItem.position[2],
                ];
                break;
              case DepthAxis:
                position = [
                  binItem.position[0],
                  binItem.position[1],
                  binItem.position[2] + dimension[2],
                ];
                break;
            }

            if (position.length === 3 && bin.putItem(item, position)) {
              fitted = true;
              break lookup;
            }
          }
        }
      }

      if (!fitted) {
        while (biggerBin != null) {
          biggerBin = this.getBiggerBinThan(bin);

          if (biggerBin != null) {
            biggerBin.items.push(item);
            const left = this.packToBin(biggerBin, biggerBin.items);

            if (left.length === 0) {
              bin = biggerBin;
              fitted = true;
              break;
            }
          }
        }

        if (!fitted) {
          unpackedItems.push(item);
        }
      }
    }

    return unpackedItems;
  }

  public pack() {
    // Sort bins, smallest to largest
    this.bins.sort((a, b) => a.volume - b.volume);

    // Sort items, largest to smallest
    this.items.sort((a, b) => b.volume - a.volume);

    while (this.items.length > 0) {
      const item = this.items[0];
      const bin = this.findFittedBin(item);

      if (bin == null) {
        this.unfitItem();
        continue;
      }

      this.#items = this.packToBin(bin, this.items);
    }

    return this.bestFittedBin;
  }
}
