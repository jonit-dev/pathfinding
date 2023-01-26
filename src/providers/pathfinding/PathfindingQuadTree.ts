import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { MapSolidsQuadTree } from "./MapSolidsQuadTree";

interface IGridCourse {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  offset: {
    x: number;
    y: number;
  };
}

@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  constructor(private mapSolidsQuadTree: MapSolidsQuadTree) {}

  public generateGridBetweenPoints(map: string, gridCourse: IGridCourse): PF.Grid {
    const { start, end } = gridCourse;

    const solids = this.mapSolidsQuadTree.getSolidsInArea(
      map,
      new Rectangle({
        x: FromGridX(start.x),
        y: FromGridY(start.y),
        width: FromGridX(end.x - start.x),
        height: FromGridY(end.y - start.y),
      })
    );

    const matrix = this.generateMatrixBetweenPoints(gridCourse, (gridX, gridY) =>
      solids.some((solid) => {
        return ToGridX(solid.x) === gridX && ToGridY(solid.y) === gridY;
      })
    );

    const pf = new PF.Grid(matrix);

    return pf;
  }

  public getNodeAt(grid: PF.Grid, gridX: number, gridY: number): PF.Node {
    return grid.nodes[gridY][gridX];
  }

  public findShortestPathBetweenPoints(map: string, gridCourse: IGridCourse): PF.Node[] {
    // const { start, end, offset } = gridCourse;

    // const grid = this.generateGridBetweenPoints(map, gridCourse);

    // // const finder = new PF.AStarFinder();

    // // const path = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, grid);

    // // const pathWithoutOffset = path.map(([x, y]) => [x + start.x, y + start.y]);

    // return pathWithoutOffset;

    return [];
  }

  private generateMatrixBetweenPoints(
    gridCourse: IGridCourse,
    isSolidFn: (gridX: number, gridY: number) => boolean
  ): number[][] {
    const { start, end } = gridCourse;

    const matrix: number[][] = [];

    const [width, height] = this.getWidthHeightBetweenPoints(start.x, start.y, end.x, end.y);

    for (let gridY = 0; gridY < height; gridY++) {
      for (let gridX = 0; gridX < width; gridX++) {
        matrix[gridY] = matrix[gridY] || [];

        const isWalkable = !isSolidFn(gridX + start.x, gridY + start.y);
        matrix[gridY][gridX] = isWalkable ? 0 : 1;
      }
    }

    if (!matrix.length) {
      throw new Error("Failed to generate pathfinding grid");
    }

    return matrix;
  }

  private getWidthHeightBetweenPoints(
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): [number, number] {
    const width = Math.abs(endGridX - startGridX) + 1;
    const height = Math.abs(endGridY - startGridY) + 1;

    return [width, height];
  }
}
