import { provide } from "inversify-binding-decorators";

@provide(PathfindingQuadTree)
export class PathfindingQuadTree {
  public generateGridBetweenPoints(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): void {}
}
