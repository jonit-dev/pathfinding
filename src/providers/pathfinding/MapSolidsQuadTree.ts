import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { provideSingleton } from "@providers/libs/provideSingleton";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
// import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import { QuadTree, Box, Point } from "js-quadtree";

@provideSingleton(MapSolidsQuadTree)
export class MapSolidsQuadTree {
  private grid: Map<string, QuadTree> = new Map();
  private gridBounds: Map<string, number[]> = new Map();

  public init(map: string, startGridX: number, startGridY: number, gridWidth: number, gridHeight: number): void {
    this.grid.set(map, new QuadTree(new Box(startGridX, startGridY, gridWidth, gridHeight)));

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

    const newSolid = new Point(gridX, gridY);

    tree.insert(newSolid);
  }

  public getSolidsInArea(map: string, area: Box): Point[] {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to get solids in area. Grid not initialized.");
    }

    return tree.query(area);
  }

  public getQuadTree(map: string): QuadTree {
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
