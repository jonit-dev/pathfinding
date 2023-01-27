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
    };

    const data = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", gridCourse);

    expect(data.grid).toBeDefined();
    expect(data.grid.width).toBe(9);
    expect(data.grid.height).toBe(9);

    expect(data.startX).toBe(-11);
    expect(data.startY).toBe(9);
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
    });
    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path[0]).toMatchObject([-11, 14]);
    expect(path[path.length - 1]).toMatchObject([-9, 16]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), inverse paths", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -3,
        y: 17,
      },
      end: {
        x: -11,
        y: 9,
      },
    });

    expect(path).toBeDefined();

    expect(path[0]).toMatchObject([-3, 17]);
    expect(path[path.length - 1]).toMatchObject([-11, 9]);

    expect(path).toMatchObject([
      [-3, 17],
      [-3, 16],
      [-3, 15],
      [-3, 14],
      [-4, 14],
      [-5, 14],
      [-5, 13],
      [-5, 12],
      [-6, 12],
      [-7, 12],
      [-7, 11],
      [-8, 11],
      [-9, 11],
      [-9, 10],
      [-9, 9],
      [-10, 9],
      [-11, 9],
    ]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), inversed paths, another test", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -9,
        y: 16,
      },
      end: {
        x: -11,
        y: 14,
      },
    });

    expect(path).toBeDefined();

    expect(path[0]).toMatchObject([-9, 16]);
    expect(path[path.length - 1]).toMatchObject([-11, 14]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES)", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 6,
        y: 22,
      },
      end: {
        x: 9,
        y: 25,
      },
    });

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [6, 22],
      [6, 23],
      [6, 24],
      [6, 25],
      [7, 25],
      [8, 25],
      [9, 25],
    ]);
  });
});
