import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { provideSingleton } from "@providers/libs/provideSingleton";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";

@provideSingleton(MapSolidsQuadTree)
export class MapSolidsQuadTree {
  private grid: Map<string, Quadtree<Rectangle>> = new Map();

  public init(map: string, startGridX: number, startGridY: number, gridWidth: number, gridHeight: number): void {
    this.grid.set(
      map,
      new Quadtree({
        x: startGridX * GRID_WIDTH,
        y: startGridY * GRID_HEIGHT,
        width: gridWidth * GRID_WIDTH,
        height: gridHeight * GRID_HEIGHT,
        maxObjects: 0,
      })
    );
  }

  public addSolid(map: string, gridX: number, gridY: number): void {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to add solid to grid. Grid not initialized.");
    }

    const newSolid = new Rectangle({
      x: gridX * GRID_WIDTH,
      y: gridY * GRID_HEIGHT,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
    });

    tree.insert(newSolid);
  }

  public getSolidsInArea(map: string, area: Rectangle): Rectangle[] {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to get solids in area. Grid not initialized.");
    }

    return tree.retrieve(area);
  }

  public getOneSolid(map: string, gridX: number, gridY: number): Rectangle<void> {
    const tree = this.grid.get(map);

    if (!tree) {
      throw new Error("Failed to get one solid. Grid not initialized.");
    }

    const solid = new Rectangle({
      x: FromGridX(gridX),
      y: FromGridY(gridY),
      width: FromGridX(GRID_WIDTH),
      height: FromGridY(GRID_HEIGHT),
    });

    return tree.retrieve(solid)[0];
  }

  public getQuadTree(map: string): Quadtree<Rectangle> {
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
