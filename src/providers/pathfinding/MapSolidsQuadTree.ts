import { provideSingleton } from "@providers/libs/provideSingleton";
import Quadtree, { QuadtreeItem } from "quadtree-lib";

@provideSingleton(MapSolidsQuadTree)
export class MapSolidsQuadTree {
  private grid: Map<string, Quadtree<Quadtree.QuadtreeItem>> = new Map();
  private gridBounds: Map<string, number[]> = new Map();

  public init(map: string, startGridX: number, startGridY: number, gridWidth: number, gridHeight: number): void {
    this.grid.set(map, new Quadtree({ width: gridWidth, height: gridHeight }));

    this.gridBounds.set(map, [startGridX, startGridY, gridWidth, gridHeight]);
  }

  public getGridBounds(map: string) {
    const values = this.gridBounds.get(map);
    return {
      x: values[0],
      y: values[1],
      width: values[2],
      height: values[3],
    };
  }

  public addSolid(map: string, gridX: number, gridY: number): void {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to add solid to grid. Grid not initialized.");
    }

    const newSolid = { x: gridX, y: gridY };
    tree.push(newSolid);
  }

  public removeSolid(map: string, gridX: number, gridY: number): void {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to add solid to grid. Grid not initialized.");
    }

    const items = tree.find((elt) => elt.x == gridX && elt.y == gridY);

    if (items && items.length) {
      for (const item of items) {
        tree.remove(item);
      }
    }
  }

  public getSolidsInArea(map: string, x: number, y: number, width: number, height: number): Map<string, boolean> {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to get solids in area. Grid not initialized.");
    }

    const y1 = y + height,
      x1 = x + width;

    const filtered = tree.filter((element) => {
      return element.x >= x && element.x < x1 && element.y >= y && element.y < y1;
    });

    const keyValue: Map<string, boolean> = new Map();
    filtered &&
      filtered.each((elt) => {
        keyValue.set(elt.x + "-" + elt.y, true);
      });
    return keyValue;
  }

  public getQuadTree(map: string): Quadtree<QuadtreeItem> {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to get quadtree. Grid not initialized.");
    }

    return tree;
  }

  public clear(): void {
    const gridEntries = this.grid.entries();

    for (const [, tree] of gridEntries) {
      tree.clear();
    }

    this.grid.clear();
  }
}
