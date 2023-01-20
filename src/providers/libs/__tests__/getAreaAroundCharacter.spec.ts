import { GRID_HEIGHT, GRID_WIDTH } from "@constants/gridConstants";
import { getAreaAroundCharacter } from "../getAreaAroundCharacter";

describe("AreaAroundCharacter", () => {
  it("calculates an area around the character  in negative coordinates", () => {
    const result = getAreaAroundCharacter(-8, 17, 7, 7);

    expect(result).toStrictEqual({
      x: -11,
      y: 14,
      width: 7 * GRID_WIDTH,
      height: 7 * GRID_HEIGHT,
    });
  });

  it("calculates an area around the character WITHOUT negative coordinates", () => {
    const result = getAreaAroundCharacter(12, 27, 5, 5);

    expect(result).toStrictEqual({
      x: 10,
      y: 25,
      width: 5 * GRID_WIDTH,
      height: 5 * GRID_HEIGHT,
    });
  });
});
