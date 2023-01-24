import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { MapSolidsQuadTree } from "./MapSolidsQuadTree";

interface IConvertedCoordinates {
  startGridX: number;
  startGridY: number;
  endGridX: number;
  endGridY: number;
}

@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  constructor(private mapSolidsQuadTree: MapSolidsQuadTree) {}

  public generateGridBetweenPoints(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): PF.Grid {
    const solids = this.mapSolidsQuadTree.getSolidsInArea(
      map,
      new Rectangle({
        x: FromGridX(startGridX),
        y: FromGridY(startGridY),
        width: FromGridX(endGridX - startGridX),
        height: FromGridY(endGridY - startGridY),
      })
    );

    const matrix = this.generateMatrixBetweenPoints(startGridX, startGridY, endGridX, endGridY, (gridX, gridY) =>
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

  public;
  findShortestPathBetweenPoints(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number,
    gridOffsetX: number,
    gridOffsetY: number
  ): PF.Node[] {
    const grid = this.generateGridBetweenPoints(map, startGridX, startGridY, endGridX, endGridY);

    const finder = new PF.AStarFinder();

    const path = finder.findPath(0, 0, grid.width - 1, grid.height - 1, grid);

    return path;
  }

  private generateMatrixBetweenPoints(
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number,
    isSolidFn: (gridX: number, gridY: number) => boolean
  ): number[][] {
    const matrix: number[][] = [];

    // generate width and height considering offset
    const [width, height] = this.getWidthHeightBetweenPoints(startGridX, startGridY, endGridX, endGridY);

    for (let gridY = startGridY; gridY < startGridY + height; gridY++) {
      matrix[gridY - startGridY] = [];
      for (let gridX = startGridX; gridX < startGridX + width; gridX++) {
        const isWalkable = !isSolidFn(gridX, gridY);
        matrix[gridY - startGridY][gridX - startGridX] = isWalkable ? 0 : 1;
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

  convertCoordinates(
    rawStartX: number,
    rawStartY: number,
    rawEndX: number,
    rawEndY: number,
    startX: number,
    startY: number
  ): IConvertedCoordinates {
    return {
      startGridX: rawStartX + startX,
      startGridY: rawStartY + startY,
      endGridX: rawEndX + startX,
      endGridY: rawEndY + startY,
    };
  }
}
