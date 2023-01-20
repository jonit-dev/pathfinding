import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { container } from "@providers/inversify/container";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { PathfindingQuadTree } from "../PathfindingQuadTree";

describe("PathfindingQuadtree", () => {
  let pathfindingQuadTree: PathfindingQuadTree;

  beforeAll(() => {
    pathfindingQuadTree = container.get(PathfindingQuadTree);
  });

  it("generates a grid between 2 points, with proper solids", () => {
    const grid = pathfindingQuadTree.generateGridBetweenPoints(0, 0, 32, 32, [
      new Rectangle({
        x: 5,
        y: 5,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      }),
      new Rectangle({
        x: 2,
        y: 3,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      }),
    ]);

    expect(grid).toBeDefined();

    expect(grid.width).toBe(32);
    expect(grid.height).toBe(32);

    expect(grid.nodes[5][5].walkable).toBe(false);
    expect(grid.nodes[5][6].walkable).toBe(true);
    expect(grid.nodes[5][7].walkable).toBe(true);
    expect(grid.nodes[2][3].walkable).toBe(false);
  });

  it("calculates a shortest path between points", () => {});
});
