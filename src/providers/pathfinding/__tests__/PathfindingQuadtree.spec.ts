import { container } from "@providers/inversify/container";
import { MapSolidsQuadTree } from "../MapSolidsQuadTree";
import { PathfindingQuadTree } from "../PathfindingQuadTree";

describe("PathfindingQuadtree", () => {
  let pathfindingQuadTree: PathfindingQuadTree;
  let mapSolidsQuadTree: MapSolidsQuadTree;

  beforeAll(() => {
    mapSolidsQuadTree = container.get(MapSolidsQuadTree);
    pathfindingQuadTree = container.get(PathfindingQuadTree);
  });

  beforeEach(() => {
    mapSolidsQuadTree.init("unit-test-map-negative-coordinate", -16, 0, 32, 32);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -5, 10);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 10);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -9, 12);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 15);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -7, 16);
  });

  it("generates a grid between 2 points, with proper solids and correct width and height", () => {
    const grid = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", -11, 9, -3, 17);

    expect(grid).toBeDefined();
    expect(grid.width).toBe(9);
    expect(grid.height).toBe(9);
  });

  it("generates a grid with proper width and height", () => {
    const grid = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", 19, 27, 20, 28);

    expect(grid).toBeDefined();
    expect(grid.width).toBe(2);
    expect(grid.height).toBe(2);
  });

  it("calculates a shortest path between points", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints(
      "unit-test-map-negative-coordinate",
      -11,
      9,
      -3,
      17,
      16,
      0
    );

    console.log(path);

    expect(path).toBeDefined();
  });
});
