import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import { provideSingleton } from "libs/provideSingleton";

@provideSingleton(GridQuadTreePathfinding)
export class GridQuadTreePathfinding {
  private grid: Map<string, Quadtree<Rectangle>> = new Map();

  public init(map: string, width: number, height: number): void {
    this.grid.set(
      map,
      new Quadtree({
        width,
        height,
      })
    );
  }

  public addNode(map: string, x: number, y: number, width: number, height: number): void {
    const tree = this.grid.get(map);
    if (tree) {
      tree.insert(
        new Rectangle({
          x,
          y,
          width,
          height,
        })
      );
    }
  }

  public getNodesInArea(map: string, area: Rectangle): Rectangle[] {
    const tree = this.grid.get(map);
    if (tree) {
      return tree.retrieve(area);
    }
    return [];
  }
}
