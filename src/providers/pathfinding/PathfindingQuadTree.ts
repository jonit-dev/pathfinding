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
}

@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  constructor(private mapSolidsQuadTree: MapSolidsQuadTree) {}

  public generateGridBetweenPoints(map: string, gridCourse: IGridCourse): any {
    const { start, end } = gridCourse;

    const startX = start.x < end.x ? start.x : end.x;
    const startY = start.y < end.y ? start.y : end.y;

    const width = Math.abs(Math.abs(end.x) - Math.abs(start.x));
    const height = Math.abs(Math.abs(end.y) - Math.abs(start.y));

    const solids = this.mapSolidsQuadTree.getSolidsInArea(
      map,
      new Rectangle({
        x: FromGridX(startX),
        y: FromGridY(startY),
        width: FromGridX(width),
        height: FromGridY(height),
      })
    );

    const matrix = this.generateMatrixBetweenPoints(gridCourse, startX, startY, (gridX, gridY) =>
      solids.some((solid) => {
        return ToGridX(solid.x) === gridX && ToGridY(solid.y) === gridY;
      })
    );

    const pf = new PF.Grid(matrix);

    return { grid: pf, startX: startX, startY: startY };
  }

  public getNodeAt(grid: PF.Grid, gridX: number, gridY: number): PF.Node {
    return grid.nodes[gridY][gridX];
  }

  public findShortestPathBetweenPoints(map: string, gridCourse: IGridCourse): PF.Node[] {
    const data = this.generateGridBetweenPoints(map, gridCourse);
    const grid = data.grid;

    const finder = new PF.AStarFinder();

    // translate co-ordinates to sub grid co-ordinates
    const firstNode = { x: gridCourse.start.x - data.startX, y: gridCourse.start.y - data.startY };
    const lastNode = { x: gridCourse.end.x - data.startX, y: gridCourse.end.y - data.startY };

    const path = finder.findPath(firstNode.x, firstNode.y, lastNode.x, lastNode.y, grid);

    const pathWithoutOffset = path.map(([x, y]) => [x + data.startX, y + data.startY]);

    return pathWithoutOffset;
  }

  private generateMatrixBetweenPoints(
    gridCourse: IGridCourse,
    startX: number,
    startY: number,
    isSolidFn: (gridX: number, gridY: number) => boolean
  ): number[][] {
    const { start, end } = gridCourse;

    const matrix: number[][] = [];

    const [width, height] = this.getWidthHeightBetweenPoints(start.x, start.y, end.x, end.y);

    for (let gridY = 0; gridY < height; gridY++) {
      for (let gridX = 0; gridX < width; gridX++) {
        matrix[gridY] = matrix[gridY] || [];

        const isWalkable = !isSolidFn(gridX + startX, gridY + startY);
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
