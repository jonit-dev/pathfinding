import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { container } from "@providers/inversify/container";
import { getAreaAroundCharacter } from "@providers/libs/getAreaAroundCharacter";
import { MapSolidsQuadTree } from "@providers/pathfinding/MapSolidsQuadTree";

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
});
