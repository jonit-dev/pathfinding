import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { container } from "@providers/inversify/container";
import { MapArea } from "../MapArea";

describe("MapArea", () => {
  let mapArea: MapArea;

  beforeAll(() => {
    mapArea = container.get(MapArea);
  });

  it("calculates an area around the character  in negative coordinates", () => {
    const result = mapArea.getAreaAroundCharacter(-8, 17, 7, 7);

    expect(result).toStrictEqual({
      x: -11 * GRID_WIDTH,
      y: 14 * GRID_HEIGHT,
      width: 7 * GRID_WIDTH,
      height: 7 * GRID_HEIGHT,
      qtIndex: expect.any(Function),
    });
  });

  it("calculates an area around the character WITHOUT negative coordinates", () => {
    const result = mapArea.getAreaAroundCharacter(12, 27, 5, 5);

    expect(result).toStrictEqual({
      x: 10 * GRID_WIDTH,
      y: 25 * GRID_HEIGHT,
      width: 5 * GRID_WIDTH,
      height: 5 * GRID_HEIGHT,
      qtIndex: expect.any(Function),
    });
  });
});
