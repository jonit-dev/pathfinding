import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { container } from "@providers/inversify/container";
import { getAreaAroundCharacter } from "@providers/libs/getAreaAroundCharacter";
import { MapSolidsQuadTree } from "@providers/pathfinding/MapSolidsQuadTree";
import { FromGridX, FromGridY } from "@rpg-engine/shared";

describe("MapSolidsQuadTree", () => {
  let mapSolidsQuadTree: MapSolidsQuadTree;

  beforeAll(() => {
    mapSolidsQuadTree = container.get(MapSolidsQuadTree);
  });

  afterEach(() => {
    mapSolidsQuadTree.clear();
  });

  it("properly finds the solid nodes in a specific area, WITHOUT NEGATIVE COORDINATES", () => {
    mapSolidsQuadTree.init("unit-test-map-negative-coordinate", 0, 0, 32, 32);

    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 4, 15);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 3, 18);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 7, 17);
    mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", 11, 25);

    const area = getAreaAroundCharacter(5, 17, 7, 7);

    const result = mapSolidsQuadTree.getSolidsInArea("unit-test-map-negative-coordinate", area);

    expect(result).toHaveLength(3);

    const hasSolidAt4x15 = result.some((solid) => solid.x === 4 * GRID_WIDTH && solid.y === 15 * GRID_HEIGHT);
    const hasSolidAt3x18 = result.some((solid) => solid.x === 3 * GRID_WIDTH && solid.y === 18 * GRID_HEIGHT);
    const hasSolidAt7x17 = result.some((solid) => solid.x === 7 * GRID_WIDTH && solid.y === 17 * GRID_HEIGHT);
    const hasSolidAt11x25 = result.some((solid) => solid.x === 11 * GRID_WIDTH && solid.y === 25 * GRID_HEIGHT);

    expect(hasSolidAt4x15).toBe(true);
    expect(hasSolidAt3x18).toBe(true);
    expect(hasSolidAt7x17).toBe(true);
    expect(hasSolidAt11x25).toBe(false);
  });

  describe("Negative coordinates support", () => {
    it("initializes the quadtree with negative coordinates", () => {
      mapSolidsQuadTree.init("unit-test-map-negative-coordinate", -16, -0, 32, 32);

      expect(mapSolidsQuadTree.getQuadTree("unit-test-map-negative-coordinate")).not.toBeUndefined();

      const quadTree = mapSolidsQuadTree.getQuadTree("unit-test-map-negative-coordinate");

      expect(quadTree.bounds).toStrictEqual({
        x: FromGridX(-16),
        y: FromGridY(0),
        width: FromGridX(32),
        height: FromGridY(32),
      });
    });

    it("fetches solids within a specified area, in a quadtree with negative coordinates", () => {
      mapSolidsQuadTree.init("unit-test-map-negative-coordinate", -16, 0, 32, 32);

      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 10);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -9, 12);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -16, 0);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -16, 1);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -5, 10);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 15);

      const area = getAreaAroundCharacter(-10, 11, 5, 5);

      const result = mapSolidsQuadTree.getSolidsInArea("unit-test-map-negative-coordinate", area);

      const hasSolidNeg10x10 = result.some((solid) => solid.x === -10 * GRID_WIDTH && solid.y === 10 * GRID_HEIGHT);
      const hasSolidNeg9x12 = result.some((solid) => solid.x === -9 * GRID_WIDTH && solid.y === 12 * GRID_HEIGHT);

      expect(hasSolidNeg10x10).toBe(true);
      expect(hasSolidNeg9x12).toBe(true);
    });

    it("fetches solids within a specified area, in a quadtree with negative coordinates", () => {
      mapSolidsQuadTree.init("unit-test-map-negative-coordinate", -16, 0, 32, 32);

      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 10);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -9, 12);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -16, 0);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -16, 1);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -5, 10);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -10, 15);
      mapSolidsQuadTree.addSolid("unit-test-map-negative-coordinate", -7, 16);

      const area = getAreaAroundCharacter(-4, 19, 7, 7);

      const result = mapSolidsQuadTree.getSolidsInArea("unit-test-map-negative-coordinate", area);

      const hasSolidNeg7x16 = result.some((solid) => solid.x === -7 * GRID_WIDTH && solid.y === 16 * GRID_HEIGHT);

      expect(result).toHaveLength(1);
      expect(hasSolidNeg7x16).toBe(true);
    });
  });
});
