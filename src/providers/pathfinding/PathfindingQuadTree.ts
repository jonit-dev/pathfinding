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
  offset?: number;
}

interface IGridBounds {
  startX: number;
  startY: number;
  height: number;
  width: number;
}

@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  constructor(private mapSolidsQuadTree: MapSolidsQuadTree) {}

  public generateGridBetweenPoints(map: string, gridCourse: IGridCourse): any {
    const bounds = this.getGridBounds(map, gridCourse);

    const solids = this.mapSolidsQuadTree.getSolidsInArea(
      map,
      new Rectangle({
        x: FromGridX(bounds.startX),
        y: FromGridY(bounds.startY),
        width: FromGridX(bounds.width),
        height: FromGridY(bounds.height),
      })
    );

    const matrix = this.generateMatrixBetweenPoints(bounds, (gridX, gridY) =>
      solids.some((solid) => {
        return ToGridX(solid.x) === gridX && ToGridY(solid.y) === gridY;
      })
    );

    const pf = new PF.Grid(matrix);

    return { grid: pf, startX: bounds.startX, startY: bounds.startY };
  }

  public getNodeAt(grid: PF.Grid, gridX: number, gridY: number): PF.Node {
    return grid.nodes[gridY][gridX];
  }

  public findShortestPathBetweenPoints(map: string, gridCourse: IGridCourse, retries?: number): PF.Node[] {
    if (!retries && retries != 0) {
      retries = 5;
    }

    const data = this.generateGridBetweenPoints(map, gridCourse);
    const grid = data.grid;

    const finder = new PF.AStarFinder();

    // translate co-ordinates to sub grid co-ordinates
    const firstNode = { x: gridCourse.start.x - data.startX, y: gridCourse.start.y - data.startY };
    const lastNode = { x: gridCourse.end.x - data.startX, y: gridCourse.end.y - data.startY };

    const path = finder.findPath(firstNode.x, firstNode.y, lastNode.x, lastNode.y, grid);

    const pathWithoutOffset = path.map(([x, y]) => [x + data.startX, y + data.startY]);

    if (pathWithoutOffset.length < 1 && retries && retries > 0) {
      const existingOffset = gridCourse.offset ?? 1;
      gridCourse.offset = existingOffset + Math.pow(10, existingOffset);
      return this.findShortestPathBetweenPoints(map, gridCourse, --retries);
    }

    return pathWithoutOffset;
  }

  private generateMatrixBetweenPoints(
    bounds: IGridBounds,
    isSolidFn: (gridX: number, gridY: number) => boolean
  ): number[][] {
    const matrix: number[][] = [];

    for (let gridY = 0; gridY < bounds.height; gridY++) {
      for (let gridX = 0; gridX < bounds.width; gridX++) {
        matrix[gridY] = matrix[gridY] || [];

        const isWalkable = !isSolidFn(gridX + bounds.startX, gridY + bounds.startY);
        matrix[gridY][gridX] = isWalkable ? 0 : 1;
      }
    }

    if (!matrix.length) {
      throw new Error("Failed to generate pathfinding grid");
    }

    return matrix;
  }

  private getGridBounds(map: string, gridCourse: IGridCourse): IGridBounds {
    const { start, end } = gridCourse;

    let startX = start.x < end.x ? start.x : end.x;
    let startY = start.y < end.y ? start.y : end.y;

    let width = Math.abs(end.x - start.x) + 1;
    let height = Math.abs(end.y - start.y) + 1;

    if (gridCourse.offset && gridCourse.offset > 0) {
      const bounds = this.mapSolidsQuadTree.getQuadTree(map).bounds;

      const minX = ToGridX(bounds.x);
      const minY = ToGridY(bounds.y);
      const maxWidth = ToGridX(bounds.width);
      const maxHeight = ToGridY(bounds.height);

      const newX = startX - gridCourse.offset;
      const newY = startY - gridCourse.offset;

      startX = newX < minX ? minX : newX;
      startY = newY < minY ? minY : newY;

      const availableWidth = maxWidth - (startX + Math.abs(minX));
      const availableHeight = maxHeight - (startY + Math.abs(minY));

      const newWidth = width + gridCourse.offset * 2;
      const newHeight = height + gridCourse.offset * 2;

      width = newWidth > availableWidth ? availableWidth : newWidth;
      height = newHeight > availableHeight ? availableHeight : newHeight;
    }

    return {
      startX,
      startY,
      height,
      width,
    };
  }
}
