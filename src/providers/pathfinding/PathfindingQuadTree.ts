import { Rectangle } from "@timohausmann/quadtree-ts";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { MapSolidsQuadTree } from "./MapSolidsQuadTree";
@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  constructor(private mapSolidsQuadTree: MapSolidsQuadTree) {}

  public generateGridBetweenPoints(
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number,
    quadTreeSolids: Rectangle[]
  ): PF.Grid {
    const matrix = [];

    // const area = this.mapSolidsQuadTree.getSolidsInArea(
    //   map,
    //   new Rectangle({
    //     x: startGridX,
    //   })
    // );

    for (let i = startGridX; i < endGridX; i++) {
      matrix[i] = [];
      for (let j = startGridY; j < endGridY; j++) {
        const hasSolid = quadTreeSolids.some((solid) => {
          return solid.x === i && solid.y === j;
        });

        matrix[i][j] = hasSolid ? 1 : 0;
      }
    }

    const pf = new PF.Grid(matrix);

    return pf;
  }
}
