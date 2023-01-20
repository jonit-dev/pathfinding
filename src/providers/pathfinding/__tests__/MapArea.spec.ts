import { container } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { MapArea } from "../MapArea";

describe("MapArea", () => {
  let mapArea: MapArea;

  beforeAll(() => {
    mapArea = container.get(MapArea);
  });

  it("calculates an area around the character  in negative coordinates", () => {
    const result = mapArea.getAreaAroundCharacter(-8, 17, 7, 7);

    expect(result).toStrictEqual({
      x: FromGridX(-11),
      y: FromGridY(14),
      width: FromGridX(7),
      height: FromGridY(7),
      qtIndex: expect.any(Function),
    });
  });

  it("calculates an area around the character WITHOUT negative coordinates", () => {
    const result = mapArea.getAreaAroundCharacter(12, 27, 5, 5);

    expect(result).toStrictEqual({
      x: FromGridX(10),
      y: FromGridY(25),
      width: FromGridX(5),
      height: FromGridY(5),
      qtIndex: expect.any(Function),
    });
  });
});
