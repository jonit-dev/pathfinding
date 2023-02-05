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
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 13);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 14);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 21);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 22);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 23);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 8, 13);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 8, 14);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 8, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 9, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 10, 24);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 14, 31);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 14, 30);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 14, 29);
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

  it("generates a grid between 2 points, verify walkables in new grid", () => {
    const x = -16,
      y = 0;

    const gridCourse = {
      start: {
        x: x,
        y: y,
      },
      end: {
        x: x + 1,
        y: y + 1,
      },
    };

    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", x, y);
    const data = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", gridCourse);
    const translatedX = x - data.startX,
      translatedY = y - data.startY;
    expect(data.grid.isWalkableAt(translatedX, translatedY)).toBeFalsy();

    mapSolidsQuadTree.removeSolid("unit-test-map-negative-coordinate", x, y);
    const data1 = pathfindingQuadTree.generateGridBetweenPoints("unit-test-map-negative-coordinate", gridCourse);

    const translatedX1 = x - data1.startX,
      translatedY1 = y - data1.startY;
    expect(data1.grid.isWalkableAt(translatedX1, translatedY1)).toBeTruthy();
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), top left to bottom right", () => {
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

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom right to top left", () => {
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

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom right to top left, another test", () => {
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

  it("calculates a shortest path between points (NEGATIVE COORDINATES), top right to bottom left", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -4,
        y: 9,
      },
      end: {
        x: -6,
        y: 11,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-4, 9],
      [-4, 10],
      [-4, 11],
      [-5, 11],
      [-6, 11],
    ]);
  });

  it("calculates a shortest path between points (NEGATIVE COORDINATES), bottom left to top right", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -6,
        y: 11,
      },
      end: {
        x: -4,
        y: 9,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-6, 11],
      [-6, 10],
      [-6, 9],
      [-5, 9],
      [-4, 9],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), top left to bottom right", () => {
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

  it("calculates a shortest path between points (POSITIVE COORDINATES), top right to bottom left", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 9,
        y: 12,
      },
      end: {
        x: 6,
        y: 15,
      },
    });

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [9, 12],
      [9, 13],
      [9, 14],
      [9, 15],
      [8, 15],
      [7, 15],
      [6, 15],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), bottom right to top left", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 9,
        y: 15,
      },
      end: {
        x: 6,
        y: 12,
      },
    });

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [9, 15],
      [9, 14],
      [9, 13],
      [9, 12],
      [8, 12],
      [7, 12],
      [6, 12],
    ]);
  });

  it("calculates a shortest path between points (POSITIVE COORDINATES), bottom left to top right", () => {
    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 6,
        y: 15,
      },
      end: {
        x: 9,
        y: 12,
      },
    });

    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [6, 15],
      [6, 14],
      [6, 13],
      [6, 12],
      [7, 12],
      [8, 12],
      [9, 12],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), horizontal line, forward", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -2,
        y: 18,
      },
      end: {
        x: 1,
        y: 18,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-2, 18],
      [-1, 18],
      [0, 18],
      [1, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), horizontal line, reverse", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 1,
        y: 18,
      },
      end: {
        x: -2,
        y: 18,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [1, 18],
      [0, 18],
      [-1, 18],
      [-2, 18],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, forward", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -15,
        y: 0,
      },
      end: {
        x: -15,
        y: 3,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 0],
      [-15, 1],
      [-15, 2],
      [-15, 3],
    ]);
  });

  it("calculates a shortest path between points (MIX COORDINATES), vertical line, reverse", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -15,
        y: 3,
      },
      end: {
        x: -15,
        y: 0,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-15, 3],
      [-15, 2],
      [-15, 1],
      [-15, 0],
    ]);
  });

  it("calculates a shortest path between points, straight line, obstacle in path", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: -10,
        y: 12,
      },
      end: {
        x: -8,
        y: 12,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [-10, 12],
      [-10, 11],
      [-9, 11],
      [-8, 11],
      [-8, 12],
    ]);
  });

  it("calculates a shortest path between points, straight line at the bottom corner of map, larger obstacle in path", () => {
    console.time("pathfindingQuadTree.findShortestPathBetweenPoints");

    const path = pathfindingQuadTree.findShortestPathBetweenPoints("unit-test-map-negative-coordinate", {
      start: {
        x: 13,
        y: 31,
      },
      end: {
        x: 15,
        y: 31,
      },
    });

    console.timeEnd("pathfindingQuadTree.findShortestPathBetweenPoints");
    expect(path).toBeDefined();

    expect(path).toMatchObject([
      [13, 31],
      [13, 30],
      [13, 29],
      [13, 28],
      [14, 28],
      [15, 28],
      [15, 29],
      [15, 30],
      [15, 31],
    ]);
  });
});
