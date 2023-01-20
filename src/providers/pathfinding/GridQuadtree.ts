import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { provideSingleton } from "@providers/libs/provideSingleton";
import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";

interface IGridNodeProps {
  walkable: boolean;
}

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

  public addSolid(map: string, x: number, y: number, props?: IGridNodeProps): void {
    const tree = this.grid.get(map);
    if (tree) {
      tree.insert(
        new Rectangle({
          x,
          y,
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
          data: props as unknown as void,
        })
      );
    }
  }

  public getSolidsInArea(map: string, area: Rectangle): Rectangle[] {
    const tree = this.grid.get(map);
    if (tree) {
      return tree.retrieve(area);
    }
    return [];
  }
}
