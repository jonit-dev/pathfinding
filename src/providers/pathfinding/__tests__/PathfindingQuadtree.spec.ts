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
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 21);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 22);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 23);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 8, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 9, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 10, 24);
  });

  it("generates a grid between 2 points, with proper solids and correct width and height", () => {
    const gridCourse = {
      start: {
        x: -11,
        y: 9,
      },
      end: {
        x: -3,
        y: 17,
      },
      offset: {
        x: 16,
        y: 0,
      },
    };

    const grid = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", gridCourse);

    expect(grid).toBeDefined();
    expect(grid.width).toBe(9 + gridCourse.offset.x);
    expect(grid.height).toBe(9 + gridCourse.offset.y);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES)", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -11,
        y: 14,
      },
      end: {
        x: -9,
        y: 16,
      },
      offset: {
        x: 16,
        y: 0,
      },
    });
    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");

    expect(path).toBeDefined();

    expect(path[0]).toMatchObject([-11, 14]);
    expect(path[path.length - 1]).toMatchObject([-9, 16]);
  });

  // it("calculates a shortest path between points (NEGATIVE COORDINATES), inversed paths", () => {
  //   const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
  //     start: {
  //       x: -11,
  //       y: 9,
  //     },
  //     end: {
  //       x: -3,
  //       y: 17,
  //     },
  //     offset: {
  //       x: 16,
  //       y: 0,
  //     },
  //   });

  //   expect(path).toBeDefined();

  //   expect(path[0]).toMatchObject([-3, 17]);
  //   expect(path[path.length - 1]).toMatchObject([-11, 9]);

  //   expect(path).toMatchObject([]);
  // });
  // it("calculates a shortest path between points (POSITIVE COORDINATES)", () => {
  //   const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
  //     start: {
  //       x: 6,
  //       y: 22,
  //     },
  //     end: {
  //       x: 9,
  //       y: 25,
  //     },
  //     offset: {
  //       x: 16,
  //       y: 0,
  //     },
  //   });

  //   expect(path).toBeDefined();

  //   expect(path).toMatchObject([
  //     [6, 22],
  //     [6, 23],
  //     [6, 24],
  //     [6, 25],
  //     [7, 25],
  //     [8, 25],
  //     [9, 25],
  //   ]);
  // });
});
