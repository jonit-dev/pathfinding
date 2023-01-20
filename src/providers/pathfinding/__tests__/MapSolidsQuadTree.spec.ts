import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { container } from "@providers/inversify/container";
import { getAreaAroundCharacter } from "@providers/libs/getAreaAroundCharacter";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { MapSolidsQuadTree } from "../MapSolidsQuadTree";

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
    expect(result).toStrictEqual([
      new Rectangle({ x: 4 * GRID_WIDTH, y: 15 * GRID_HEIGHT, width: GRID_WIDTH, height: GRID_HEIGHT }),
      new Rectangle({ x: 3 * GRID_WIDTH, y: 18 * GRID_HEIGHT, width: GRID_WIDTH, height: GRID_HEIGHT }),
      new Rectangle({ x: 7 * GRID_WIDTH, y: 17 * GRID_HEIGHT, width: GRID_WIDTH, height: GRID_HEIGHT }),
    ]);
  });
});
